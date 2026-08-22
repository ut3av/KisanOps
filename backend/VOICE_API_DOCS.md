# 🌾 KisanOps Multilingual Voice API

This module provides the Vernacular Voice AI Assistant backend for the KisanOps platform.

## Setup Instructions

1. Install Dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Environment Variables:
Configure these in your environment or `.env` file before running:
```bash
export OPENAI_API_KEY="your-openai-api-key"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-anon-key"
# Optional (if using Groq for faster STT):
# export WHISPER_API_BASE="https://api.groq.com/openai/v1"
# export WHISPER_API_KEY="your-groq-key"
```

3. Run the Server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## Sample cURL Commands

### 1. Fallback Text Parsing
```bash
curl -X POST "http://localhost:8000/api/voice/parse-text" \
     -H "Content-Type: application/json" \
     -d '{"text": "Mujhe Sehore mein kal ke liye ek tractor chahiye, 5 acre ki jotai karni hai."}'
```

### 2. Full Audio Processing (STT -> Intent -> Supabase -> TTS)
```bash
curl -X POST "http://localhost:8000/api/voice/process-audio" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@sample_hindi.m4a"
```

### 3. Run Unit Tests
```bash
cd backend
pytest tests/
```
