import os
import json
import re
from typing import Optional
from openai import AsyncOpenAI
from models.schemas import FarmerRequirementIntent, TaskCategory

# Support Groq, OpenAI, or Custom LLM endpoint
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1" if GROQ_API_KEY else "https://api.openai.com/v1")
LLM_API_KEY = GROQ_API_KEY or OPENAI_API_KEY or "dummy-key"
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile" if GROQ_API_KEY else "gpt-4o-mini")

client = AsyncOpenAI(
    api_key=LLM_API_KEY,
    base_url=LLM_BASE_URL
)

SYSTEM_PROMPT = """
You are an expert multilingual AI assistant for 'AgriFlow (KisanOps)', an agricultural machinery platform in India.
Your job is to parse raw user queries (in Hindi, Hinglish, or English) spoken or typed by Indian farmers and extract structured machinery booking intents.

CRITICAL INSTRUCTIONS:
1. Detect spoken/written language: If it's English, set `response_language` to 'en'. If it's Hindi or Hinglish, set it to 'hi'.
2. ALWAYS translate extracted `target_location`, `machine_type_required`, and `crop_name` to standard English for backend database querying.
   - Example locations: "सीहोर" / "Sehor" -> "Sehore", "भोपाल" -> "Bhopal", "रायसेन" -> "Raisen", "बिलकिसगंज" -> "Bilkisganj"
   - Example machine types: "हार्वेस्टर" / "कंबाइन" -> "Harvester", "रोटावेटर" -> "Rotavator", "ट्रैक्टर" -> "Tractor", "सीड ड्रिल" -> "Seed Drill", "स्प्रेयर" -> "Sprayer", "थ्रेशर" -> "Thresher"

3. Rules for Indian Agrarian Terms:
   - "katai" (कटाई) / "katna" -> harvesting -> Machine: Harvester -> task_category: harvesting
   - "jotai" (जुताई) / "jutai" / "jotna" -> ploughing -> Machine: Rotavator or Tractor -> task_category: ploughing
   - "buwai" (बुवाई) / "buai" / "bona" -> sowing -> Machine: Seed Drill -> task_category: sowing
   - "chhidkaw" (छिड़काव) / "spray" -> spraying -> Machine: Sprayer -> task_category: spraying
   - "gahai" (गहाई) / "daura" -> threshing -> Machine: Thresher -> task_category: threshing
   - "dhulai" (ढुलाई) / "trolley" -> transport -> Machine: Tractor / Trailer -> task_category: transport
   - "khet" (खेत) / "bigha" / "acre" -> extract numeric acreage (e.g., "5 acre khet" -> farm_acres: 5.0, "paanch acre" -> 5.0)
   - "gehu" (गेहूं) -> "wheat", "chana" (चना) -> "gram", "sarso" (सरसों) -> "mustard", "dhan" (धान) -> "paddy", "soybean" (सोयाबीन) -> "soybean"

Return ONLY a valid JSON object matching the FarmerRequirementIntent schema. Do NOT include markdown code fences or conversational text.
"""

async def extract_intent(user_text: str) -> FarmerRequirementIntent:
    """
    Extracts structured intent from a Hindi/Hinglish/English user query.
    Attempts LLM API call first, with instant deterministic fallback for zero downtime.
    """
    cleaned_text = user_text.strip()
    if not cleaned_text:
        return FarmerRequirementIntent()

    # If valid API key is present, attempt LLM completion
    if LLM_API_KEY and LLM_API_KEY != "dummy-key" and not LLM_API_KEY.startswith("your-"):
        try:
            completion = await client.chat.completions.create(
                model=LLM_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Extract structured intent from this farmer query: '{cleaned_text}'"}
                ],
                response_format={"type": "json_object"},
                temperature=0.0,
                timeout=4.0
            )

            result_json = completion.choices[0].message.content
            if result_json:
                intent_dict = json.loads(result_json)
                return FarmerRequirementIntent(**intent_dict)
        except Exception as e:
            print(f"[IntentService] LLM API call failed or timed out: {str(e)}. Using heuristic parser.")

    # High-Accuracy Deterministic Heuristic Parser Fallback
    return _heuristic_intent_extractor(cleaned_text)


def _heuristic_intent_extractor(text: str) -> FarmerRequirementIntent:
    """
    Rule-based entity extractor for Hindi/Hinglish/English agrarian queries.
    Guarantees robust zero-shot extraction even without internet or API keys.
    """
    lower = text.lower()

    # 1. Detect Language
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
    hinglish_markers = ['chahiye', 'karna', 'karo', 'kya', 'hai', 'kaise', 'kitna', 'gehu', 'khet', 'katai', 'jotai', 'buwai', 'kal', 'parso', 'batao', 'chhidkaw']
    has_hinglish = any(marker in lower for marker in hinglish_markers)
    response_lang = 'hi' if (has_devanagari or has_hinglish) else 'en'

    # 2. Task Category & Machine Type
    task = TaskCategory.unknown
    machine_type = None

    if any(w in lower for w in ['katai', 'katna', 'harvest', 'हार्वेस्टर', 'कटाई', 'combain', 'combine']):
        task = TaskCategory.harvesting
        machine_type = "Harvester"
    elif any(w in lower for w in ['jotai', 'jutai', 'jotna', 'plough', 'plow', 'rotavator', 'जुताई', 'रोटावेटर', 'tilling', 'cultivat']):
        task = TaskCategory.ploughing
        machine_type = "Rotavator" if ('rotavator' in lower or 'रोटावेटर' in lower) else "Tractor"
    elif any(w in lower for w in ['buwai', 'buai', 'bona', 'sow', 'sowing', 'seed drill', 'बुवाई', 'सीड ड्रिल', 'beej']):
        task = TaskCategory.sowing
        machine_type = "Seed Drill"
    elif any(w in lower for w in ['chhidkaw', 'spray', 'spraying', 'dawa', 'छिड़काव', 'स्प्रेयर', 'pesticide']):
        task = TaskCategory.spraying
        machine_type = "Sprayer"
    elif any(w in lower for w in ['gahai', 'thresh', 'thresher', 'गहाई', 'थ्रेशर', 'nikalna']):
        task = TaskCategory.threshing
        machine_type = "Thresher"
    elif any(w in lower for w in ['dhulai', 'trolley', 'trailer', 'transport', 'ढुलाई', 'ट्रॉली', 'mandi']):
        task = TaskCategory.transport
        machine_type = "Trailer"
    elif any(w in lower for w in ['tractor', 'ट्रैक्टर']):
        task = TaskCategory.ploughing
        machine_type = "Tractor"

    # 3. Crop Name
    crop = None
    if any(w in lower for w in ['gehu', 'gehun', 'wheat', 'गेहूं', 'गेहू']):
        crop = "wheat"
    elif any(w in lower for w in ['chana', 'gram', 'चना', 'chickpea']):
        crop = "gram"
    elif any(w in lower for w in ['soybean', 'soya', 'सोयाबीन']):
        crop = "soybean"
    elif any(w in lower for w in ['sarso', 'mustard', 'सरसों']):
        crop = "mustard"
    elif any(w in lower for w in ['dhan', 'paddy', 'rice', 'धान', 'चावल']):
        crop = "paddy"
    elif any(w in lower for w in ['makka', 'maize', 'corn', 'मक्का']):
        crop = "maize"
    elif any(w in lower for w in ['pyaj', 'onion', 'प्याज']):
        crop = "onion"

    # 4. Acreage Parsing (Numbers & Hindi Words)
    acres = None
    # Check numeric patterns: "5 acre", "5.5 एकड़", "5 bigha"
    num_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़|एकड|एकर|bigha|बीघा|ekad)', lower)
    if num_match:
        try:
            acres = float(num_match.group(1))
        except ValueError:
            pass
    
    if acres is None:
        # Check standalone digit before or after khet / farm
        digit_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:khet|खेत|farm)', lower)
        if digit_match:
            try:
                acres = float(digit_match.group(1))
            except ValueError:
                pass

    if acres is None:
        # Hindi written numbers
        hindi_numbers = {
            'ek': 1.0, 'एक': 1.0,
            'do': 2.0, 'दो': 2.0,
            'teen': 3.0, 'तीन': 3.0,
            'char': 4.0, 'chaar': 4.0, 'चार': 4.0,
            'paanch': 5.0, 'panch': 5.0, 'पांच': 5.0, 'पाँच': 5.0,
            'chhah': 6.0, 'chhe': 6.0, 'छह': 6.0,
            'saat': 7.0, 'सात': 7.0,
            'aath': 8.0, 'आठ': 8.0,
            'nau': 9.0, 'नौ': 9.0,
            'das': 10.0, 'दस': 10.0,
            'pandrah': 15.0, 'पंद्रह': 15.0,
            'bees': 20.0, 'बीस': 20.0,
        }
        for word, val in hindi_numbers.items():
            if re.search(rf'\b{word}\b', lower):
                acres = val
                break

    # 5. Target Location
    location = None
    location_map = {
        'sehore': 'Sehore', 'सीहोर': 'Sehore',
        'bhopal': 'Bhopal', 'भोपाल': 'Bhopal',
        'raisen': 'Raisen', 'रायसेन': 'Raisen',
        'bilkisganj': 'Bilkisganj', 'बिलकिसगंज': 'Bilkisganj',
        'ashta': 'Ashta', 'आष्टा': 'Ashta',
        'ichhawar': 'Ichhawar', 'इछावर': 'Ichhawar',
        'nasrullaganj': 'Nasrullaganj', 'नसरुल्लागंज': 'Nasrullaganj',
        'shyampur': 'Shyampur', 'श्यामपुर': 'Shyampur',
        'berasia': 'Berasia', 'बैरसिया': 'Berasia',
        'indore': 'Indore', 'इंदौर': 'Indore',
        'dewas': 'Dewas', 'देवास': 'Dewas',
        'hoshangabad': 'Hoshangabad', 'होशंगाबाद': 'Hoshangabad',
    }
    for loc_key, standard_loc in location_map.items():
        if loc_key in lower:
            location = standard_loc
            break
    
    # Default to Sehore if not specified but agrarian context present
    if not location and (task != TaskCategory.unknown or machine_type):
        location = "Sehore"

    # 6. Target Date
    target_date = None
    if any(w in lower for w in ['kal', 'कल', 'tomorrow']):
        target_date = "tomorrow"
    elif any(w in lower for w in ['parso', 'परसों', 'day after tomorrow']):
        target_date = "day after tomorrow"
    elif any(w in lower for w in ['aaj', 'आज', 'today']):
        target_date = "today"
    elif any(w in lower for w in ['somwar', 'monday', 'सोमवार']):
        target_date = "Monday"
    elif any(w in lower for w in ['mangalwar', 'tuesday', 'मंगलवार']):
        target_date = "Tuesday"
    elif any(w in lower for w in ['budhwar', 'wednesday', 'बुधवार']):
        target_date = "Wednesday"
    elif any(w in lower for w in ['guruwar', 'thursday', 'गुरुवार']):
        target_date = "Thursday"
    elif any(w in lower for w in ['shukrawar', 'friday', 'शुक्रवार']):
        target_date = "Friday"

    return FarmerRequirementIntent(
        task_category=task,
        crop_name=crop,
        farm_acres=acres or 5.0,
        target_date=target_date or "tomorrow",
        target_location=location,
        machine_type_required=machine_type or "Tractor",
        response_language=response_lang
    )
