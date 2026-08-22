from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class TaskCategory(str, Enum):
    ploughing = "ploughing"
    sowing = "sowing"
    spraying = "spraying"
    harvesting = "harvesting"
    threshing = "threshing"
    transport = "transport"
    unknown = "unknown"

class FarmerRequirementIntent(BaseModel):
    task_category: TaskCategory = Field(
        default=TaskCategory.unknown,
        description="The category of the farming task (e.g., 'katai' -> harvesting, 'jotai' -> ploughing, 'buwai' -> sowing, 'chhidkaw' -> spraying)"
    )
    crop_name: Optional[str] = Field(
        default=None,
        description="Crop name in English (e.g., 'wheat', 'soybean', 'gram', 'mustard', 'paddy', 'cotton')"
    )
    farm_acres: Optional[float] = Field(
        default=None,
        description="Size of the farm in acres, parsed as a float (e.g., 5.0, 8.0, 12.5)"
    )
    target_date: Optional[str] = Field(
        default=None,
        description="Target booking date as ISO string (YYYY-MM-DD) or relative expression like 'tomorrow', 'kal', 'parso', 'next Tuesday'"
    )
    target_location: Optional[str] = Field(
        default=None,
        description="Village or district name mapped to standard English (e.g., 'सीहोर' -> 'Sehore', 'भोपाल' -> 'Bhopal', 'रायसेन' -> 'Raisen')"
    )
    machine_type_required: Optional[str] = Field(
        default=None,
        description="Machine type needed in standard English (e.g., 'Harvester', 'Rotavator', 'Tractor', 'Seed Drill', 'Sprayer', 'Thresher')"
    )
    response_language: str = Field(
        default="hi",
        description="Detected language code for the response: 'hi' for Hindi/Hinglish, 'en' for English"
    )

class ParseTextRequest(BaseModel):
    text: str = Field(..., description="Raw text input in Hindi, Hinglish, or English")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Optional caller context (user role, farm ID, coordinates)")

class MatchScoreSummary(BaseModel):
    machine_id: str
    identifier: str
    match_score: int
    reasons: List[str] = []

class ProcessVoiceResponse(BaseModel):
    transcribed_text: str = Field(..., description="STT Transcribed text from audio input")
    language_detected: str = Field(default="hi", description="Detected language code (hi/en)")
    intent_data: FarmerRequirementIntent = Field(..., description="Structured intent extracted from speech or text")
    matched_machines: List[Dict[str, Any]] = Field(default=[], description="List of available matching machines from Supabase")
    assistant_response_text: str = Field(..., description="Natural conversational assistant response in Hindi/English")
    audio_base64: Optional[str] = Field(default=None, description="Base64 encoded MP3 audio data URI (data:audio/mp3;base64,...) for immediate playback")
    match_score_summary: Optional[List[MatchScoreSummary]] = Field(default=None, description="Explainable scoring breakdown for matched equipment")
