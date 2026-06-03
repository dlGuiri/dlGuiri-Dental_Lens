# main_api.py
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import stream_response
from typing import List
import traceback
import logging

from lime_inference import get_lime_predictor
from tongue_segmentation import get_segmentor

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== SEGMENTATION HELPER ====================

async def segment_image(image_bytes: bytes) -> bytes:
    """
    Runs SAM segmentation. Only called before LIME — never before fast prediction.
    Raises HTTPException(422) on failure.
    """
    try:
        segmentor = get_segmentor()
        segmented_bytes = segmentor.segment(image_bytes, background="black")
        logger.info("Segmentation complete.")
        return segmented_bytes
    except Exception as e:
        logger.error("Segmentation failed: %s\n%s", e, traceback.format_exc())
        raise HTTPException(
            status_code=422,
            detail=f"Tongue segmentation failed: {str(e)}. "
                   "Make sure the uploaded image contains a visible tongue."
        )


# ==================== FAST PREDICTION ENDPOINT ====================
# Raw image → CNN+Transformer directly. No segmentation. Returns immediately.

@app.post("/predict-fast")
async def predict_fast_endpoint(file: UploadFile = File(...)):
    """
    Fast path: raw image → CNN+Transformer prediction.
    Segmentation is intentionally skipped here for speed.
    The frontend shows this result within seconds while LIME runs in the background.
    """
    try:
        logger.info("Fast prediction (no segmentation) — file: %s", file.filename)
        image_bytes = await file.read()

        predictor = get_lime_predictor()
        result = predictor.predict(image_bytes)

        logger.info("Fast prediction successful: %s", result["prediction"])
        return JSONResponse(content={"status": "success", "prediction": result})

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in predict_fast_endpoint: %s\n%s", e, traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Fast prediction failed: {str(e)}")


# ==================== LIME GENERATION ENDPOINT ====================
# Raw image → SAM segmentation → LIME. Segmentation runs here, not before.

@app.post("/generate-lime")
async def generate_lime_endpoint(
    file: UploadFile = File(...),
    num_samples: int = 300,
):
    """
    Slow path: raw image → SAM segmentation → LIME explanation.
    Segmentation ensures LIME highlights tongue features, not background noise.
    Called in the background by the frontend after fast prediction already returned.
    """
    try:
        if not 100 <= num_samples <= 1000:
            raise HTTPException(
                status_code=400,
                detail="num_samples must be between 100 and 1000"
            )

        logger.info("LIME generation — file: %s, samples: %d", file.filename, num_samples)
        image_bytes = await file.read()

        # Segment first — LIME should explain the tongue region only
        segmented_bytes = await segment_image(image_bytes)

        predictor = get_lime_predictor()
        result = predictor.predict_with_lime(segmented_bytes, num_samples=num_samples)

        logger.info("LIME explanation generated successfully.")
        return JSONResponse(content={
            "status": "success",
            "explanation_image": result["explanation_image"],
            "lime_statistics": result["lime_statistics"],
            "num_samples": result["num_samples"],
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in generate_lime_endpoint: %s\n%s", e, traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"LIME generation failed: {str(e)}")


# ==================== COMBINED ENDPOINT ====================
# Kept for completeness. Also segments before LIME.

@app.post("/predict-with-lime")
async def predict_with_lime_endpoint(
    file: UploadFile = File(...),
    num_samples: int = 300,
):
    try:
        if not 100 <= num_samples <= 1000:
            raise HTTPException(
                status_code=400,
                detail="num_samples must be between 100 and 1000"
            )

        logger.info("Predict-with-LIME — file: %s, samples: %d", file.filename, num_samples)
        image_bytes = await file.read()

        # Segment before LIME
        segmented_bytes = await segment_image(image_bytes)

        predictor = get_lime_predictor()
        result = predictor.predict_with_lime(segmented_bytes, num_samples=num_samples)

        logger.info("LIME explanation generated for: %s", result["prediction"]["prediction"])
        return JSONResponse(content={"status": "success", **result})

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in predict_with_lime_endpoint: %s\n%s", e, traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"LIME explanation failed: {str(e)}")


# ==================== SEGMENTATION PREVIEW (debug only) ====================

@app.post("/segment-only")
async def segment_only_endpoint(file: UploadFile = File(...)):
    """Returns the segmented image as PNG — useful for visually checking SAM output."""
    try:
        logger.info("Segment-only — file: %s", file.filename)
        image_bytes = await file.read()
        segmented_bytes = await segment_image(image_bytes)
        return StreamingResponse(
            iter([segmented_bytes]),
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=segmented.png"},
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in segment_only_endpoint: %s\n%s", e, traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Segmentation failed: {str(e)}")


# ==================== CHATBOT ENDPOINT ====================

class ChatRequest(BaseModel):
    prompt: str
    image: str | None = None


@app.post("/chat-stream")
async def chat_stream(request: ChatRequest):
    def event_generator():
        try:
            for chunk in stream_response(request.prompt, request.image):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(event_generator(), media_type="text/plain")


# ==================== HEALTH CHECKS ====================

@app.get("/lime/health")
async def lime_health_check():
    try:
        predictor = get_lime_predictor()
        return {
            "status": "healthy",
            "model_loaded": True,
            "model_type": "TongueLens (ConvNeXt + Swin Transformer)",
            "num_classes": len(predictor.classes),
            "tongue_classes": predictor.classes,
        }
    except Exception as e:
        logger.error("LIME health check failed: %s", e)
        raise HTTPException(status_code=503, detail=f"LIME model not available: {str(e)}")


@app.get("/segmentation/health")
async def segmentation_health_check():
    try:
        from tongue_segmentation import MODEL_TYPE, DEVICE, IMAGE_SIZE
        get_segmentor()
        return {
            "status": "healthy",
            "model_type": f"SAM {MODEL_TYPE.upper()} (fine-tuned)",
            "device": DEVICE,
            "image_size": IMAGE_SIZE,
        }
    except Exception as e:
        logger.error("Segmentation health check failed: %s", e)
        raise HTTPException(status_code=503, detail=f"Segmentation model not available: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "Tongue Disease Detection API",
        "pipeline": {
            "fast_path": "Upload → CNN+Transformer → instant prediction (no segmentation)",
            "lime_path": "Upload → SAM Segmentation → LIME explanation (background)",
        },
        "endpoints": {
            "prediction": {
                "/predict-fast": "Raw image → instant prediction (no segmentation) ⚡",
                "/generate-lime": "Segment → LIME explanation (background task) 🔍",
                "/predict-with-lime": "Segment → prediction + LIME in one call 📊",
                "/segment-only": "Segmentation preview for debugging 🛠️",
            },
            "chatbot": {"/chat-stream": "Streaming chatbot responses"},
            "health": {
                "/lime/health": "Check TongueLens model status",
                "/segmentation/health": "Check SAM model status",
                "/health": "General health check",
            },
        },
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "tongue-api",
        "models": {
            "segmentation": "SAM (fine-tuned) — used before LIME only",
            "classification": "TongueLens_V1 — used for fast prediction (no segmentation)",
        },
    }