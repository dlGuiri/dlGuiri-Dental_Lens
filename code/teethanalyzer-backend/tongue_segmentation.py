"""
tongue_segmentation.py
"""

import logging
import os

import cv2
import numpy as np
import torch
from segment_anything import sam_model_registry
from segment_anything.utils.transforms import ResizeLongestSide

logger = logging.getLogger(__name__)


def _select_device() -> str:
    explicit = os.getenv("SAM_DEVICE", "").strip()
    if explicit:
        logger.info("SAM device overridden by SAM_DEVICE env var: %s", explicit)
        return explicit
    if torch.cuda.is_available():
        name = torch.cuda.get_device_name(0)
        logger.info("SAM using CUDA GPU: %s", name)
        return "cuda:0"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        logger.info("SAM using Apple MPS (Metal) GPU.")
        return "mps"
    logger.warning("No GPU detected — SAM will run on CPU.")
    return "cpu"


# ── FIX 1: Use raw strings (r"...") so backslashes aren't escape sequences ──
MODEL_TYPE   = os.getenv("SAM_MODEL_TYPE",   "vit_b")
BASE_CKPT    = os.getenv("SAM_BASE_CKPT",    r"C:\Users\User\Personal Projects\code\code\teethanalyzer-backend\sam_vit_b_01ec64.pth")
TRAINED_CKPT = os.getenv("SAM_TRAINED_CKPT", r"C:\Users\User\Personal Projects\code\code\teethanalyzer-backend\best.pth")
IMAGE_SIZE   = int(os.getenv("SAM_IMAGE_SIZE", "256"))
DEVICE       = _select_device()

BOX_LEFT   = float(os.getenv("SAM_BOX_LEFT",   "0.15"))
BOX_TOP    = float(os.getenv("SAM_BOX_TOP",    "0.45"))
BOX_RIGHT  = float(os.getenv("SAM_BOX_RIGHT",  "0.85"))
BOX_BOTTOM = float(os.getenv("SAM_BOX_BOTTOM", "0.95"))


class TongueSegmentor:

    def __init__(self):
        logger.info("Loading SAM base model (%s) from %s …", MODEL_TYPE, BASE_CKPT)
        self.sam = sam_model_registry[MODEL_TYPE](checkpoint=BASE_CKPT)

        logger.info("Loading fine-tuned weights from %s …", TRAINED_CKPT)
        trained_weights = torch.load(TRAINED_CKPT, map_location="cpu")
        self.sam.load_state_dict(trained_weights)

        self.device = DEVICE
        self.sam.to(self.device)
        self.sam.eval()

        # YOUR improvement: flag-based approach works well with autocast
        self._use_fp16 = "cuda" in self.device
        if self._use_fp16:
            logger.info("Mixed precision (fp16/autocast) enabled for SAM image encoder on %s.", self.device)

        self.transform = ResizeLongestSide(self.sam.image_encoder.img_size)
        logger.info("SAM tongue segmentor ready on %s.", self.device)

    def segment(
        self,
        image_bytes: bytes,
        background: str = "black",   # black = correct — hybrid model trained on black bg images
        return_mask: bool = False,
    ) -> bytes:
        original_bgr  = self._decode(image_bytes)
        original_rgb  = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
        original_size = original_rgb.shape[:2]

        preprocessed = self._preprocess(original_rgb)
        mask         = self._run_sam(preprocessed, original_size)
        segmented    = self._apply_mask(original_rgb, mask, background)

        segmented_bgr = cv2.cvtColor(segmented, cv2.COLOR_RGB2BGR)
        ok, encoded   = cv2.imencode(".png", segmented_bgr)
        if not ok:
            raise RuntimeError("Failed to encode segmented image as PNG.")

        result_bytes = encoded.tobytes()
        return (result_bytes, mask) if return_mask else result_bytes

    @staticmethod
    def _decode(image_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image bytes — unsupported format?")
        return img

    @staticmethod
    def _preprocess(rgb: np.ndarray) -> np.ndarray:
        """Percentile-clip → normalise → resize to IMAGE_SIZE to match SAM fine-tuning resolution."""
        lo, hi  = np.percentile(rgb, 0.5), np.percentile(rgb, 99.5)
        clipped = np.clip(rgb, lo, hi)
        normed  = (clipped - clipped.min()) / (clipped.max() - clipped.min() + 1e-8) * 255.0
        # The resize must match what was used during SAM fine-tuning (IMAGE_SIZE=256).
        # Skipping this means the bounding-box ratios and spatial features are misaligned.
        resized = cv2.resize(normed.astype(np.uint8), (IMAGE_SIZE, IMAGE_SIZE))
        return resized

    def _run_sam(self, preprocessed: np.ndarray, original_size: tuple) -> np.ndarray:
        H, W = preprocessed.shape[:2]   # IMAGE_SIZE x IMAGE_SIZE after _preprocess

        # YOUR improvement: bounding box uses H,W of the preprocessed image (correct)
        box = np.array([
            int(W * BOX_LEFT),
            int(H * BOX_TOP),
            int(W * BOX_RIGHT),
            int(H * BOX_BOTTOM),
        ])

        resize_img  = self.transform.apply_image(preprocessed)
        img_tensor  = torch.as_tensor(
            resize_img.transpose(2, 0, 1), dtype=torch.float32
        ).to(self.device)
        input_image = self.sam.preprocess(img_tensor[None])

        with torch.no_grad():
            # YOUR improvement: torch.autocast is safer than .half() on the whole model
            device_type = "cuda" if "cuda" in self.device else "cpu"
            with torch.autocast(device_type=device_type, enabled=self._use_fp16):
                image_embedding = self.sam.image_encoder(input_image)

            # Cast back to fp32 — prompt encoder and mask decoder must stay fp32
            image_embedding = image_embedding.float()

            box_resized = self.transform.apply_boxes(box[None], (H, W))
            box_torch   = torch.as_tensor(
                box_resized, dtype=torch.float32, device=self.device
            )
            if box_torch.dim() == 2:
                box_torch = box_torch[:, None, :]

            sparse_emb, dense_emb = self.sam.prompt_encoder(
                points=None,
                boxes=box_torch,
                masks=None,
            )

            mask_preds, _ = self.sam.mask_decoder(
                image_embeddings=image_embedding,
                image_pe=self.sam.prompt_encoder.get_dense_pe(),
                sparse_prompt_embeddings=sparse_emb,
                dense_prompt_embeddings=dense_emb,
                multimask_output=False,
            )

        raw_mask = mask_preds[0, 0].cpu().numpy()
        binary   = (raw_mask > 0.5).astype(np.uint8)
        resized  = cv2.resize(
            binary, (original_size[1], original_size[0]),
            interpolation=cv2.INTER_NEAREST,
        )
        return resized

    @staticmethod
    def _apply_mask(rgb: np.ndarray, mask: np.ndarray, background: str) -> np.ndarray:
        result   = rgb.copy()
        bg_color = (255, 255, 255) if background == "white" else (0, 0, 0)
        result[mask == 0] = bg_color
        return result


_segmentor: TongueSegmentor | None = None


def get_segmentor() -> TongueSegmentor:
    global _segmentor
    if _segmentor is None:
        _segmentor = TongueSegmentor()
    return _segmentor