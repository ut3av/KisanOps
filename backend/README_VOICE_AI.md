# KisanOps Multilingual Voice AI Assistant

This folder contains the Python FastAPI backend for the Multilingual Voice & Vernacular AI Assistant for AgriFlow (KisanOps).

## Features
- **Speech-To-Text**: Fast transcription of Hindi/Hinglish audio using Groq Whisper API (or OpenAI Whisper).
- **Intent Extraction**: Strict Pydantic-based JSON extraction of farmer intents (task, crop, acreage, dates, location, machine) using zero-shot system prompts via OpenAI.
- **Supabase Matcher**: Direct integration to query and score machinery from a Supabase PostgreSQL database.
- **Text-To-Speech**: Conversational Hindi synthesized audio generation using `gTTS` directly streamed back as base64 to the frontend.

## Setup

1. **Install dependencies**:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Set Environment Variables**:
```bash
export OPENAI_API_KEY="sk-..."
export GROQ_API_KEY="gsk_..."
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"
```

3. **Run the API**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Sample cURL Commands

### 1. Parse Text (Fallback)
```bash
curl -X POST "http://localhost:8000/api/voice/parse-text" \
     -H "Content-Type: application/json" \
     -d '{"text": "मुझे कल सीहोर में 5 एकड़ के खेत के लिए रोटावेटर चाहिए।"}'
```

### 2. Process Audio (Multipart)
```bash
# First, record a small sample.wav file with your voice
curl -X POST "http://localhost:8000/api/voice/process-audio" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "audio_file=@sample.wav;type=audio/wav"
```

## Unit Tests

Run tests using pytest (you will need to install `pytest` and `httpx`):

```python
# test_voice_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_parse_text_endpoint():
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "कल ५ एकड़ गेहूं की कटाई के लिए हार्वेस्टर चाहिए भोपाल में"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["intent_data"]["task_category"] == "harvesting"
    assert data["intent_data"]["target_location"] == "भोपाल"
    assert data["assistant_response_text"] is not None
```
