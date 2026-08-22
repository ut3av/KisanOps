import os
import json
from openai import AsyncOpenAI
from models.schemas import FarmerRequirementIntent

# Switching to Groq because the OpenAI key provided has Insufficient Quota (429)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your-groq-api-key")
client = AsyncOpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """
You are an expert multilingual AI assistant for 'AgriFlow (KisanOps)', an agricultural machinery platform in India.
Your job is to parse raw user queries (in Hindi, Hinglish, or English) from farmers and extract structured booking intents.

CRITICAL INSTRUCTIONS:
1. Detect the user's spoken language: If it's pure English, set `response_language` to 'en'. If it's Hindi or Hinglish, set it to 'hi'.
2. ALWAYS translate the extracted `target_location` and `machine_type_required` to standard English for backend DB querying (e.g., "सीहोर" -> "Sehore", "रोटावेटर" -> "Rotavator").

Rules for Indian Agrarian Terms (translate these to standard English tasks/machines):
- "katai" (कटाई) -> harvesting -> Harvester
- "jotai" (जुताई) -> ploughing -> Rotavator / Cultivator / Plough
- "buwai" (बुवाई) -> sowing -> Seed Drill
- "chhidkaw" (छिड़काव) -> spraying -> Sprayer
- "gahai" (गहाई) -> threshing -> Thresher
- "khet" -> farm (look for numbers preceding it to denote acres, e.g., "paanch acre khet" -> 5)

Extract the information into a valid JSON matching the FarmerRequirementIntent schema.
Output ONLY raw JSON. No markdown, no conversational text.
"""

async def extract_intent(user_text: str) -> FarmerRequirementIntent:
    """
    Extracts structured intent from a Hindi/Hinglish text string using Groq LLM.
    """
    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Extract the intent from this farmer's request and return ONLY JSON: '{user_text}'"}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        
        result_json = completion.choices[0].message.content
        intent_dict = json.loads(result_json)
        intent_data = FarmerRequirementIntent(**intent_dict)
        print(f"DEBUG - EXTRACTED INTENT: {intent_data.model_dump()}")
        return intent_data
    except Exception as e:
        print(f"Error in Intent Extraction: {str(e)}")
        # Fallback empty intent for resilience
        return FarmerRequirementIntent()
