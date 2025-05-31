# main_api.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from prediction import predict_disease
from chatbot import generate_response
from pydantic import BaseModel

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to ["http://localhost:3000"] if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# For image prediction
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    predicted_class = await predict_disease(file)
    return JSONResponse(content={"prediction": predicted_class})

# For chatbot
class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = generate_response(request.prompt)
        return JSONResponse(content={"response": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
