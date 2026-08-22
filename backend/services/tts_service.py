import os
import base64
from io import BytesIO
from gtts import gTTS
import asyncio

async def synthesize_speech(text: str, lang: str = 'hi') -> str:
    """
    Converts Hindi / English response text to natural audio using gTTS.
    Runs asynchronously in a threadpool and returns a base64 encoded data URI
    ready for immediate frontend HTML5 <audio> playback.
    """
    if not text or not text.strip():
        return ""

    # Clean markdown formatting (*, #, _, •) for smooth natural speech synthesis
    clean_text = text.replace('*', '').replace('#', '').replace('_', '').replace('•', '').strip()
    if len(clean_text) > 400:
        clean_text = clean_text[:400] + "..."

    try:
        # Standardize language code
        tts_lang = 'hi' if lang in ['hi', 'hinglish', 'hindi'] else 'en'

        def generate_mp3_bytes() -> bytes:
            tts = gTTS(text=clean_text, lang=tts_lang, slow=False)
            fp = BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()

        loop = asyncio.get_event_loop()
        audio_bytes = await loop.run_in_executor(None, generate_mp3_bytes)

        # Encode to data URI for zero frontend roundtrips
        base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
        return f"data:audio/mp3;base64,{base64_audio}"

    except Exception as e:
        print(f"[TTSService] Speech synthesis warning: {str(e)}")
        # Return empty audio gracefully so text response is still rendered
        return ""
