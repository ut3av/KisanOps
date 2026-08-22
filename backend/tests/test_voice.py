import sys
import os
import io
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app
from models.schemas import TaskCategory
from services.intent_service import _heuristic_intent_extractor
from services.machinery_matcher import get_matching_machines, _calculate_machine_score

client = TestClient(app)

def test_health_check():
    """Verify that the FastAPI server is running and healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_parse_text_hindi_harvesting():
    """Test full pipeline for pure Hindi harvest query."""
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "मुझे 8 एकड़ गेहूं की कटाई के लिए कंबाइन हार्वेस्टर चाहिए सीहोर में।"}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert data["language_detected"] == "hi"
    intent = data["intent_data"]
    assert intent["task_category"] == TaskCategory.harvesting.value
    assert intent["machine_type_required"] == "Harvester"
    assert intent["crop_name"] == "wheat"
    assert intent["farm_acres"] == 8.0
    assert intent["target_location"] == "Sehore"
    
    assert len(data["matched_machines"]) > 0
    assert "नमस्ते" in data["assistant_response_text"]

def test_parse_text_hinglish_ploughing():
    """Test full pipeline for natural Hinglish ploughing request."""
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "Mujhe kal 5 acre khet ki jotai karni hai, rotavator chahiye Bhopal mein."}
    )
    assert response.status_code == 200
    data = response.json()
    
    intent = data["intent_data"]
    assert intent["task_category"] == TaskCategory.ploughing.value
    assert intent["machine_type_required"] == "Rotavator"
    assert intent["farm_acres"] == 5.0
    assert intent["target_location"] == "Bhopal"
    assert intent["target_date"] == "tomorrow"

def test_parse_text_sowing_seed_drill():
    """Test intent parsing for sowing with crop detection."""
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "5 एकड़ में चना की बुवाई के लिए सीड ड्रिल चाहिए।"}
    )
    assert response.status_code == 200
    data = response.json()
    
    intent = data["intent_data"]
    assert intent["task_category"] == TaskCategory.sowing.value
    assert intent["machine_type_required"] == "Seed Drill"
    assert intent["crop_name"] == "gram"

def test_parse_text_english():
    """Test English language query response."""
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "I need a tractor for 10 acres ploughing tomorrow in Sehore."}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert data["language_detected"] == "en"
    intent = data["intent_data"]
    assert intent["task_category"] == TaskCategory.ploughing.value
    assert intent["farm_acres"] == 10.0
    assert "Namaste" in data["assistant_response_text"] or "tractor" in data["assistant_response_text"].lower()

def test_empty_text_validation():
    """Ensure empty text inputs return 400 Bad Request."""
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "   "}
    )
    assert response.status_code == 400

def test_process_audio_endpoint():
    """Test audio upload endpoint with simulated audio file."""
    fake_audio = io.BytesIO(b"RIFF....WAVEfmt ....data....fake_audio_payload_bytes_for_testing")
    response = client.post(
        "/api/voice/process-audio",
        files={"audio_file": ("test_farmer_voice.wav", fake_audio, "audio/wav")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "transcribed_text" in data
    assert "intent_data" in data
    assert len(data["matched_machines"]) > 0
    assert "assistant_response_text" in data

def test_machinery_matcher_scoring():
    """Unit test scoring algorithm logic."""
    intent = _heuristic_intent_extractor("8 acre katai ke liye harvester chahiye")
    machines = get_matching_machines(intent)
    assert len(machines) > 0
    assert machines[0]["category"] == "HARVESTER"
    assert machines[0]["match_score"] >= 90
