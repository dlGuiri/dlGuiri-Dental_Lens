FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

COPY backend_api.py .
COPY prediction.py .
COPY oral_disease_model-V3.pth .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "backend_api:app", "--host", "0.0.0.0", "--port", "8000"]
