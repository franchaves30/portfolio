from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import json
import time
import traceback
import posthog

# --- SETUP ---
script_dir = Path(__file__).parent
root_dir = script_dir.parent
env_path = root_dir / '.env.local'
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("OPENAI_API_KEY")

# PostHog Initialization
posthog.api_key = os.getenv("POSTHOG_API_KEY")
posthog.host = os.getenv("POSTHOG_HOST", "https://us.i.posthog.com")

if not api_key:
    print("WARNING: OPENAI_API_KEY not found in environment variables.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",
    streaming=True,
    temperature=0.7,
    model_kwargs={"stream_options": {"include_usage": True}}
)

class ChatRequest(BaseModel):
    messages: list
    session_id: str = "unknown"

def get_portfolio_data():
    try:
        data_path = root_dir / 'data.txt'
        with open(data_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception:
        return "Error loading data."

def send_posthog_event(event_name: str, properties: dict):
    """
    Background task to send PostHog event and flush the queue.
    Crucial for Vercel Serverless to ensure event is sent before container freeze.
    """
    try:
        posthog.capture(properties.get("distinct_id", "backend_user"), event_name, properties)
        posthog.flush()
    except Exception as e:
        print(f"PostHog Error: {e}")

@app.post("/api/chat")
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    start_time = time.time()
    session_id = request.session_id
    model_version = llm.model_name

    try:
        print("--- DEBUG: Chat started ---")
        context_data = get_portfolio_data()
        
        # Parse conversation history
        history = []
        for msg in request.messages[:-1]: # Exclude the last message which is the current question
            if msg.get('role') == 'user':
                history.append(HumanMessage(content=msg.get('content', '')))
            elif msg.get('role') == 'assistant':
                history.append(AIMessage(content=msg.get('content', '')))
        
        last_message = request.messages[-1]
        user_question = ""
        if isinstance(last_message, dict):
            user_question = last_message.get('content', '')
        
        # Enhanced System Prompt
        system_template = """You are an AI assistant for Fran Chaves's professional portfolio. 
        Your goal is to represent Fran professionally based strictly on the provided context.
        
        Context about Fran:
        {context}
        
        Instructions:
        1.  **Be Professional yet Personable:** Use a confident and approachable tone.
        2.  **Strict Adherence to Context:** Answer ONLY from the context. If not in context, say you don't have that info. No hallucinations.
        3.  **ULTRA CONCISE:** Maximum 2-3 sentences. Get straight to the key point. This is voice-first - every word costs TTS credits.
        4.  **Simple Language:** Conversational, clear. No complex sentences.
        5.  **Third Person:** Refer to Fran in third person (e.g., "Fran has experience in...").
        """

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_template),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}")
        ])
        
        # Note: We use the raw LLM for streaming to access message chunks with usage data
        # instead of StrOutputParser which only returns strings.
        chain = prompt | llm

        async def generate():
            prompt_tokens = 0
            completion_tokens = 0
            total_tokens = 0
            
            try:
                async for chunk in chain.astream({
                    "context": context_data,
                    "history": history,
                    "question": user_question
                }):
                    # Extract usage metadata if present (usually in the last chunk with stream_options)
                    if hasattr(chunk, 'usage_metadata') and chunk.usage_metadata:
                        usage = chunk.usage_metadata
                        prompt_tokens = usage.get("input_tokens", 0)
                        completion_tokens = usage.get("output_tokens", 0)
                        total_tokens = usage.get("total_tokens", 0)
                    
                    # Yield the content
                    if chunk.content:
                        yield chunk.content

                # Calculate latency after stream finishes
                latency_ms = int((time.time() - start_time) * 1000)
                
                background_tasks.add_task(
                    send_posthog_event,
                    "ai_inference_success",
                    {
                        "distinct_id": session_id,
                        "session_id": session_id,
                        "latency_ms": latency_ms,
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "total_tokens": total_tokens,
                        "model_version": model_version
                    }
                )

            except Exception as e:
                error_trace = traceback.format_exc()
                background_tasks.add_task(
                    send_posthog_event,
                    "ai_inference_failed",
                    {
                        "distinct_id": session_id,
                        "session_id": session_id,
                        "error_type": type(e).__name__,
                        "error_message": str(e),
                        "stack_trace": error_trace
                    }
                )
                raise e

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        error_trace = traceback.format_exc()
        background_tasks.add_task(
            send_posthog_event,
            "ai_inference_failed",
            {
                "distinct_id": session_id,
                "session_id": session_id,
                "error_type": type(e).__name__,
                "error_message": str(e),
                "stack_trace": error_trace
            }
        )
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/track")
async def track(data: dict):
    """Log analytics events to Vercel console and persist to Google Sheets via Google Forms"""
    try:
        # 1. Existing debug print
        print(f"ANALYTICS_EVENT: {json.dumps(data)}")

        # 2. Extract fields (Robustly)
        # Event: 'event' or default to 'page_view'
        event_name = data.get("event", "page_view")
        
        # Referrer: 'referrer'
        referrer = data.get("referrer", "")
        
        # Screen: 'screen' or 'resolution'
        screen = data.get("screen") or data.get("resolution", "")
        
        # UTMs: can be nested in 'utms' or flat in the data itself
        utms = data.get("utms")
        if not isinstance(utms, dict):
            # If not nested, look at the top level
            utm_source = data.get("utm_source", "")
            utm_medium = data.get("utm_medium", "")
        else:
            # If nested, extract from dictionary
            utm_source = utms.get("utm_source", "")
            utm_medium = utms.get("utm_medium", "")

        # 3. Construct payload for Google Form
        # Field IDs from target documentation
        form_data = {
            "entry.1735252693": event_name,
            "entry.1408622509": referrer,
            "entry.1907457726": utm_source,
            "entry.296274226": utm_medium,
            "entry.1004098287": screen
        }

        # 4. Target URL
        form_url = "https://docs.google.com/forms/d/e/1FAIpQLSfWNF-ginw7-prB-bNCzZvYOLZWsrCMgaY-iRZo94we2g2R6w/formResponse"

        # 5. Send POST request (wrapped in try/except)
        try:
            response = requests.post(form_url, data=form_data, timeout=5)
            if response.status_code != 200:
                print(f"WARNING: Google Form returned status {response.status_code}")
        except Exception as google_err:
            print(f"WARNING: Failed to send data to Google Forms: {google_err}")

        return {"status": "ok"}
    except Exception as e:
        print(f"ERROR in tracking: {e}")
        return {"status": "error", "message": str(e)}


