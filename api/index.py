from fastapi import FastAPI, HTTPException
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

# --- SETUP ---
script_dir = Path(__file__).parent
root_dir = script_dir.parent
env_path = root_dir / '.env.local'
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("OPENAI_API_KEY")

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
    temperature=0.7
)

class ChatRequest(BaseModel):
    messages: list

def get_portfolio_data():
    try:
        data_path = root_dir / 'data.txt'
        with open(data_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception:
        return "Error loading data."

@app.post("/api/chat")
async def chat(request: ChatRequest):
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
        
        chain = prompt | llm | StrOutputParser()

        async def generate():
            async for chunk in chain.astream({
                "context": context_data,
                "history": history,
                "question": user_question
            }):
                yield chunk

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
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


