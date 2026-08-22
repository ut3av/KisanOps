# 🌾 KisanOps Multilingual Voice & Vernacular AI Assistant API

Production-ready Multilingual Voice & Vernacular AI Assistant for **AgriFlow (KisanOps)**. This backend allows low-literacy Indian farmers to speak naturally in Hindi, Hinglish, or English, transcribes voice inputs, extracts structured machinery booking intents, queries Supabase for fleet availability, and responds in natural Hindi audio and text.

---

## 🏗️ Architecture & Pipeline

```
  ┌─────────────────────────────────┐
  │ Farmer Voice (Hindi / Hinglish) │ (.wav, .mp3, .m4a, .webm)
  └──────────────┬──────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────┐
  │ 1. STT Service (Faster-Whisper) │ Whisper large-v3 / Groq API
  └──────────────┬──────────────────┘
                 │ Transcribed text (e.g. "सीहोर में 8 एकड़ गेहूं कटाई के लिए हार्वेस्टर चाहिए")
                 ▼
  ┌─────────────────────────────────┐
  │ 2. Intent Extraction Engine     │ Pydantic `FarmerRequirementIntent`
  │    (Groq / OpenAI / Heuristic)  │ Agrarian entity mapper (katai, jotai, buwai, etc.)
  └──────────────┬──────────────────┘
                 │ Task: harvesting, Machine: Harvester, Acres: 8, Loc: Sehore
                 ▼
  ┌─────────────────────────────────┐
  │ 3. Supabase Machinery Matcher   │ Queries PostgreSQL `machines` table
  │    & 4-Factor Suitability Rank  │ Task (40%) + Proximity (25%) + Health (20%) + Rate (15%)
  └──────────────┬──────────────────┘
                 │ Top 2 Machines + Natural Hindi dialogue formatting
                 ▼
  ┌─────────────────────────────────┐
  │ 4. Text-To-Speech (gTTS)        │ Asynchronous threadpool audio synthesis
  └──────────────┬──────────────────┘
                 │ Base64 MP3 Data URI (`data:audio/mp3;base64,...`)
                 ▼
  ┌─────────────────────────────────┐
  │ 5. Frontend Immediate Playback  │ JSON Response with direct HTML5 audio playback
  └─────────────────────────────────┘
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Variables (`.env`)
Create a `.env` file in the `backend/` directory:
```env
# LLM & Whisper API Keys (Groq or OpenAI)
GROQ_API_KEY="gsk_your_groq_api_key"
OPENAI_API_KEY="sk-your-openai-api-key"

# Supabase PostgreSQL Integration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Optional Custom Settings
LLM_MODEL="llama-3.3-70b-versatile"
WHISPER_MODEL="whisper-large-v3"
```

> **Note**: If API keys are not supplied, the assistant runs in **Deterministic Agrarian NLP Mode** with zero downtime, perfectly handling regional Hindi agrarian queries and local fleet data.

### 3. Start the FastAPI Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be available at:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoints Reference

### 1. `POST /api/voice/process-audio`
Accepts multipart audio file upload (.wav, .mp3, .m4a, .webm) and executes the complete STT -> Intent -> Supabase -> TTS pipeline.

#### Request (Multipart Form):
- `audio_file`: Binary audio file.

#### Response (`200 OK`):
```json
{
  "transcribed_text": "मुझे 8 एकड़ गेहूं की कटाई के लिए कंबाइन हार्वेस्टर चाहिए सीहोर में।",
  "language_detected": "hi",
  "intent_data": {
    "task_category": "harvesting",
    "crop_name": "wheat",
    "farm_acres": 8.0,
    "target_date": "tomorrow",
    "target_location": "Sehore",
    "machine_type_required": "Harvester",
    "response_language": "hi"
  },
  "matched_machines": [
    {
      "id": "mach-jd-harv-07",
      "identifier": "JD-HARV-07",
      "category": "HARVESTER",
      "brand": "John Deere",
      "model": "W70 Combine Harvester",
      "base_rate_per_hour": 1500,
      "health_score": 96,
      "rating": 4.9,
      "match_score": 98,
      "match_reasons": [
        "✓ Excellent match for harvesting",
        "✓ Stationed at Sehore Agri Centre",
        "✓ Certified 96% health"
      ]
    }
  ],
  "assistant_response_text": "नमस्ते किसान भाई! 🙏 मुझे आपके 8 एकड़ खेत के लिए Sehore में Harvester मिल गया है। **John Deere W70 Combine Harvester** उपलब्ध है, जिसका किराया **₹1500 प्रति घंटा** (ऑपरेटर सहित) है। क्या मैं इसे आपके लिए बुक कर दूँ?",
  "audio_base64": "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAA..."
}
```

---

### 2. `POST /api/voice/parse-text`
Fallback endpoint for typed or pre-transcribed text queries (Hindi, Hinglish, or English).

#### Request (`application/json`):
```json
{
  "text": "Mujhe kal 5 acre khet ki jotai karni hai, rotavator chahiye Bhopal mein."
}
```

#### Response (`200 OK`):
```json
{
  "transcribed_text": "Mujhe kal 5 acre khet ki jotai karni hai, rotavator chahiye Bhopal mein.",
  "language_detected": "hi",
  "intent_data": {
    "task_category": "ploughing",
    "crop_name": null,
    "farm_acres": 5.0,
    "target_date": "tomorrow",
    "target_location": "Bhopal",
    "machine_type_required": "Rotavator",
    "response_language": "hi"
  },
  "matched_machines": [
    {
      "id": "mach-shaktiman-rot",
      "identifier": "SHAK-ROT-03",
      "category": "ROTAVATOR",
      "brand": "Shaktiman",
      "model": "Champion Regular 7-Feet",
      "base_rate_per_hour": 800,
      "match_score": 96
    }
  ],
  "assistant_response_text": "नमस्ते किसान भाई! 🙏 मुझे आपके 5 एकड़ खेत के लिए Bhopal में Rotavator मिल गया है। **Shaktiman Champion Regular 7-Feet** उपलब्ध है, जिसका किराया **₹800 प्रति घंटा** है। क्या मैं इसे आपके लिए बुक कर दूँ?",
  "audio_base64": "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAA..."
}
```

---

## 🧪 Running Unit Tests

Execute the automated pytest suite verifying Hindi/Hinglish parsing, Supabase machine ranking, and speech synthesis:
```bash
pytest backend/tests/test_voice.py -v
```

---

## 💻 Sample cURL Commands

### 1. Test Typed Hindi / Hinglish Query
```bash
curl -X POST "http://localhost:8000/api/voice/parse-text" \
     -H "Content-Type: application/json" \
     -d '{"text": "मुझे 8 एकड़ गेहूं कटाई के लिए हार्वेस्टर चाहिए सीहोर में।"}'
```

### 2. Test Audio File Upload
```bash
curl -X POST "http://localhost:8000/api/voice/process-audio" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "audio_file=@sample_voice.wav"
```

### 3. Check Health Status
```bash
curl -X GET "http://localhost:8000/health"
```
