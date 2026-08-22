import time
from fastapi import APIRouter, UploadFile, File, HTTPException, Body, status
from models.schemas import ProcessVoiceResponse, ParseTextRequest
from services.stt_service import process_audio_to_text
from services.intent_service import extract_intent
from services.machinery_matcher import get_matching_machines, format_assistant_response
from services.tts_service import synthesize_speech

router = APIRouter()

@router.post(
    "/voice/process-audio",
    response_model=ProcessVoiceResponse,
    status_code=status.HTTP_200_OK,
    summary="Process spoken Hindi/Hinglish audio into structured machine booking"
)
async def process_audio(audio_file: UploadFile = File(...)):
    """
    Accepts multipart/form-data audio file (.wav, .mp3, .m4a, .webm), runs:
    1. Speech-to-Text via Whisper (multilingual with Hindi/Hinglish detection)
    2. Zero-Shot Entity Extraction into FarmerRequirementIntent
    3. Supabase PostgreSQL Fleet Matching & Suitability Scoring
    4. Conversational Hindi response generation
    5. Text-to-Speech (gTTS) encoding into base64 data URI for instant playback
    """
    if not audio_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file with a valid filename is required"
        )

    start_time = time.time()
    try:
        # Read the raw audio bytes
        audio_bytes = await audio_file.read()
        if len(audio_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty audio payload received"
            )

        # 1. Speech to Text
        stt_result = await process_audio_to_text(audio_bytes, audio_file.filename)
        transcribed_text = stt_result.get("text", "")
        language_detected = stt_result.get("language", "hi")

        if not transcribed_text:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Speech-to-text failed to transcribe audio input"
            )

        # 2. Extract Structured Intent (LLM + Agrarian NLP Fallback)
        intent_data = await extract_intent(transcribed_text)

        # 3. Match Machines from Supabase
        matched_machines = get_matching_machines(intent_data)

        # 4. Generate Natural Hindi Assistant Response
        assistant_response_text = format_assistant_response(intent_data, matched_machines)

        # 5. Text to Speech Synthesis
        lang_code = getattr(intent_data, 'response_language', language_detected or 'hi')
        audio_base64 = await synthesize_speech(assistant_response_text, lang_code)

        elapsed_ms = int((time.time() - start_time) * 1000)
        print(f"[VoiceAPI] Processed audio '{audio_file.filename}' in {elapsed_ms}ms. Intent: {intent_data.task_category} / {intent_data.machine_type_required}")

        return ProcessVoiceResponse(
            transcribed_text=transcribed_text,
            language_detected=language_detected,
            intent_data=intent_data,
            matched_machines=matched_machines,
            assistant_response_text=assistant_response_text,
            audio_base64=audio_base64
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[VoiceAPI] Unexpected error processing audio: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing voice input: {str(e)}"
        )


@router.post(
    "/voice/parse-text",
    response_model=ProcessVoiceResponse,
    status_code=status.HTTP_200_OK,
    summary="Parse typed Hindi/Hinglish query into structured machine booking"
)
async def parse_text(request: ParseTextRequest = Body(...)):
    """
    Accepts raw text (Hindi/Hinglish/English) for fallback typed queries,
    running the same LLM parsing, Supabase matching, and audio synthesis pipeline.
    """
    raw_text = request.text.strip()
    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text field cannot be empty"
        )

    start_time = time.time()
    try:
        # 1. Extract Structured Intent
        intent_data = await extract_intent(raw_text)
        language_detected = getattr(intent_data, 'response_language', 'hi')

        # 2. Match Machines from Supabase
        matched_machines = get_matching_machines(intent_data)

        # 3. Generate Natural Conversational Response
        assistant_response_text = format_assistant_response(intent_data, matched_machines)

        # 4. Text to Speech Synthesis
        audio_base64 = await synthesize_speech(assistant_response_text, language_detected)

        elapsed_ms = int((time.time() - start_time) * 1000)
        print(f"[VoiceAPI] Parsed text in {elapsed_ms}ms: '{raw_text[:40]}...' -> {intent_data.machine_type_required}")

        return ProcessVoiceResponse(
            transcribed_text=raw_text,
            language_detected=language_detected,
            intent_data=intent_data,
            matched_machines=matched_machines,
            assistant_response_text=assistant_response_text,
            audio_base64=audio_base64
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[VoiceAPI] Error parsing text: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while parsing text: {str(e)}"
        )
