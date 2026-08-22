from pydantic import BaseModel, Field
from typing import Optional, List
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
    task_category: TaskCategory = Field(default=TaskCategory.unknown, description="The category of the farming task (e.g., 'katai' -> harvesting, 'jotai' -> ploughing)")
    crop_name: Optional[str] = Field(default=None, description="Crop name, e.g., wheat, soybean, gram, chana")
    farm_acres: Optional[float] = Field(default=None, description="Size of the farm in acres, parse numbers if spoken")
    target_date: Optional[str] = Field(default=None, description="ISO date or relative string like 'kal', 'parso', 'next Tuesday'")
    target_location: Optional[str] = Field(default=None, description="Village or district name. MUST translate to standard English (e.g., 'सीहोर' -> 'Sehore', 'भोपाल' -> 'Bhopal')")
    machine_type_required: Optional[str] = Field(default=None, description="Machine type needed. MUST translate to standard English (e.g., 'हार्वेस्टर' -> 'Harvester', 'रोटावेटर' -> 'Rotavator')")
    response_language: str = Field(default="hi", description="Detected language code for the response: 'hi' for Hindi/Hinglish, 'en' for English.")

class ParseTextRequest(BaseModel):
    text: str

class ProcessVoiceResponse(BaseModel):
    transcribed_text: str
    language_detected: str
    intent_data: FarmerRequirementIntent
    matched_machines: List[dict]
    assistant_response_text: str
    audio_base64: Optional[str] = None
