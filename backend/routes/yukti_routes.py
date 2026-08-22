from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from services.intent_service import extract_intent
from services.machinery_matcher import get_matching_machines, format_assistant_response
from services.tts_service import synthesize_speech

router = APIRouter()

class YuktiChatRequest(BaseModel):
    query: str
    role: str = "FARMER"
    language: str = "hi"
    context: Optional[Dict[str, Any]] = None

class YuktiChatResponse(BaseModel):
    text: str
    language: str
    action_card: Optional[Dict[str, Any]] = None
    suggested_replies: List[str] = []
    audio_base64: Optional[str] = None

@router.post("/yukti/chat", response_model=YuktiChatResponse)
async def yukti_chat(request: YuktiChatRequest = Body(...)):
    """
    Intelligent Conversational Agent for KisanOps (Yukti AI)
    Handles both Farmer and CHC Operations queries with action payloads.
    """
    user_query = request.query.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # 1. Extract Intent & Entities
    intent_data = await extract_intent(user_query)
    matched_machines = get_matching_machines(intent_data)
    
    # 2. Format Response Text
    response_text = format_assistant_response(intent_data, matched_machines)
    lang = getattr(intent_data, 'response_language', request.language or 'hi')

    # 3. Generate Audio
    audio_b64 = await synthesize_speech(response_text, lang)

    # 4. Generate Action Card payload if equipment matched
    action_card = None
    if matched_machines:
        m = matched_machines[0]
        action_card = {
            "type": "BOOK_MACHINE",
            "title": m.get("name", "Agricultural Machine"),
            "subtitle": f"{m.get('type', 'Equipment')} • Location: {m.get('current_location', 'Sehore')}",
            "badge": "AI Recommended",
            "badgeColor": "emerald",
            "payload": {
                "machine": m,
                "activity": "HARVESTING" if "harvester" in user_query.lower() else "SOIL_PREPARATION",
                "acres": 8,
                "estimatedHours": 6.4,
                "estimatedTotal": m.get("hourly_rate", 1200) * 6.4
            }
        }

    suggested = [
        "हाँ, तुरंत बुक करें (Confirm Booking)" if lang == 'hi' else "Confirm Booking",
        "AgriCredit सीमा चेक करें" if lang == 'hi' else "Check AgriCredit Limit",
        "मौसम पूर्वानुमान देखें" if lang == 'hi' else "Check 7-Day Weather"
    ]

    return YuktiChatResponse(
        text=response_text,
        language=lang,
        action_card=action_card,
        suggested_replies=suggested,
        audio_base64=audio_b64
    )

