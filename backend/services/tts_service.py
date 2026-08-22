import os
import base64
from io import BytesIO
from gtts import gTTS
import asyncio

async def synthesize_speech(text: str, lang: str = 'hi') -> str:
    """
    Converts text to speech using Google TTS (gTTS) in the specified language and returns a base64 encoded string.
    Runs synchronously but wrapped for async FastAPI use.
    """
    try:
        def generate_audio():
            tts = gTTS(text=text, lang=lang, slow=False)
            fp = BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()

        # Run the blocking gTTS call in a thread pool
        loop = asyncio.get_event_loop()
        audio_bytes = await loop.run_in_executor(None, generate_audio)
        
        # Encode as base64 for direct frontend playback (data:audio/mp3;base64,...)
        base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
        return f"data:audio/mp3;base64,{base64_audio}"
    
    except Exception as e:
        print(f"Error in TTS Service: {str(e)}")
        return ""
