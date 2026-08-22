from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "KisanOps Voice AI"}

def test_parse_text_fallback():
    # Since Supabase and OpenAI keys are missing, we expect generic responses from exceptions/mocks
    response = client.post(
        "/api/voice/parse-text",
        json={"text": "Mujhe Sehore mein kal ke liye ek tractor chahiye, 5 acre ki jotai karni hai."}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["transcribed_text"] == "Mujhe Sehore mein kal ke liye ek tractor chahiye, 5 acre ki jotai karni hai."
    assert "intent_data" in data
    assert "assistant_response_text" in data
