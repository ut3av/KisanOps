from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from models.schemas import ProcessVoiceResponse, ParseTextRequest
from services.stt_service import process_audio_to_text
from services.intent_service import extract_intent
from services.machinery_matcher import get_matching_machines, format_assistant_response
from services.tts_service import synthesize_speech

router = APIRouter()

@router.post("/voice/process-audio", response_model=ProcessVoiceResponse)
async def process_audio(audio_file: UploadFile = File(...)):
    """
    Accepts multipart/form-data audio file, runs STT, extracts intent, 
    queries Supabase, generates a response and TTS audio base64.
    """
    if not audio_file.filename:
        raise HTTPException(status_code=400, detail="Audio file required")
        
    # Read the audio bytes
    audio_bytes = await audio_file.read()
    
    # 1. Speech to Text
    stt_result = await process_audio_to_text(audio_bytes, audio_file.filename)
    transcribed_text = stt_result.get("text", "")
    language_detected = stt_result.get("language", "hi")
    
    if not transcribed_text:
        raise HTTPException(status_code=500, detail="Failed to transcribe audio")

    # 2. Extract Intent
    intent_data = await extract_intent(transcribed_text)
    
    # 3. Match Machines from Supabase
    matched_machines = get_matching_machines(intent_data)
    
    # 4. Generate Text Response
    assistant_response_text = format_assistant_response(intent_data, matched_machines)
    
    # 5. Text to Speech
    lang_code = getattr(intent_data, 'response_language', 'hi')
    audio_base64 = await synthesize_speech(assistant_response_text, lang_code)
    
    return ProcessVoiceResponse(
        transcribed_text=transcribed_text,
        language_detected=language_detected,
        intent_data=intent_data,
        matched_machines=matched_machines,
        assistant_response_text=assistant_response_text,
        audio_base64=audio_base64
    )

@router.post("/voice/parse-text", response_model=ProcessVoiceResponse)
async def parse_text(request: ParseTextRequest = Body(...)):
    """
    Accepts raw text (Hindi/Hinglish/English) for fallback typed queries, 
    runs intent extraction and Supabase matching.
    """
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
        
    # 1. Extract Intent
    intent_data = await extract_intent(text)
    
    # 2. Match Machines from Supabase
    matched_machines = get_matching_machines(intent_data)
    
    # 3. Generate Text Response
    assistant_response_text = format_assistant_response(intent_data, matched_machines)
    
    # 4. Text to Speech
    lang_code = getattr(intent_data, 'response_language', 'hi')
    audio_base64 = await synthesize_speech(assistant_response_text, lang_code)
    
    return ProcessVoiceResponse(
        transcribed_text=text,
        language_detected=lang_code,
        intent_data=intent_data,
        matched_machines=matched_machines,
        assistant_response_text=assistant_response_text,
        audio_base64=audio_base64
    )
