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


