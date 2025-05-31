from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from chatbot import generate_response
from pydantic import BaseModel
from fastapi.responses import JSONResponse

app = FastAPI()

# CORS for frontend (React, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = generate_response(request.prompt)
        return JSONResponse(content={"response": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
