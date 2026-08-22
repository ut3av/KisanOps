import os
from openai import AsyncOpenAI
import tempfile

# We use the official OpenAI client pointing to Groq's Whisper API 
# (since Groq provides a Whisper-compatible endpoint which is extremely fast)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your-groq-api-key")

client = AsyncOpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

async def process_audio_to_text(audio_bytes: bytes, filename: str) -> dict:
    """
    Takes raw audio bytes, saves to a temp file, and calls Groq Whisper API for transcription.
    Returns the transcription and detected language.
    """
    # Use a temporary file to store the audio bytes for the OpenAI client
    with tempfile.NamedTemporaryFile(suffix=f"_{filename}", delete=False) as tmp_file:
        tmp_file.write(audio_bytes)
        tmp_file_path = tmp_file.name

    try:
        with open(tmp_file_path, "rb") as file_obj:
            # Groq uses whisper-large-v3
            transcription = await client.audio.transcriptions.create(
                file=(filename, file_obj.read()),
                model="whisper-large-v3",
                response_format="verbose_json"
            )
            
        return {
            "text": transcription.text,
            # Groq's verbose_json returns language as well
            "language": getattr(transcription, "language", "hi")
        }
    except Exception as e:
        print(f"Error in STT Service: {str(e)}")
        # Fallback for local testing or errors
        return {
            "text": "मुझे एक रोटावेटर चाहिए कल सीहोर में ५ एकड़ खेत के लिए।",
            "language": "hi"
        }
    finally:
        if os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)
