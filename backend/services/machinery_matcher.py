import os
from supabase import create_client, Client
from models.schemas import FarmerRequirementIntent

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-key")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    supabase = None

def get_matching_machines(intent: FarmerRequirementIntent) -> list:
    """
    Queries Supabase 'machines' table based on extracted intent.
    Computes a simple rule-based suitability match score.
    """
    if not supabase:
        print("Warning: Supabase client not initialized. Returning mock data.")
        return _get_mock_machines(intent)
        
    try:
        print(f"DEBUG - SEARCHING DB FOR: type={intent.machine_type_required}, location={intent.target_location}")
        query = supabase.table("machines").select("*").eq("status", "AVAILABLE")
        
        # If the intent explicitly requires a specific machine type
        if intent.machine_type_required:
            query = query.ilike('type', f"%{intent.machine_type_required}%")
            
        # If the intent explicitly requires a specific location
        if intent.target_location:
            query = query.ilike('location', f"%{intent.target_location}%")
            
        # Execute query
        response = query.execute()
        machines = response.data
        
        if not machines:
            return []

        # Filter and Score matches
        scored_machines = []
        for machine in machines:
            score = 100 # Base score
            scored_machines.append({
                "machine": machine,
                "match_score": score
            })
            
        # Sort by score descending
        scored_machines.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Return top 2 matching options
        return [sm["machine"] for sm in scored_machines[:2]]

    except Exception as e:
        print(f"Error querying Supabase: {str(e)}")
        return []

def format_assistant_response(intent: FarmerRequirementIntent, machines: list) -> str:
    """
    Generates a natural response based on the intent and matched machines, matching the detected language.
    """
    lang = getattr(intent, 'response_language', 'hi')
    
    if not machines:
        if lang == 'en':
            return "Sorry, I couldn't find any available machines matching your requirement at this time. Please try again later."
        else:
            return "क्षमा करें, मुझे इस समय आपकी आवश्यकता के अनुसार कोई मशीन उपलब्ध नहीं मिली। कृपया बाद में प्रयास करें।"
    
    m_type = intent.machine_type_required or ("machine" if lang == 'en' else "मशीन")
    loc = intent.target_location or ("your area" if lang == 'en' else "आपके क्षेत्र")
    
    if lang == 'en':
        response_text = f"I found a {m_type} in {loc}. "
        if len(machines) == 1:
            m = machines[0]
            response_text += f"'{m.get('name', 'Machine')}' is available at ₹{m.get('hourly_rate', 'N/A')} per hour. Shall I book it for you?"
        else:
            m1 = machines[0]
            m2 = machines[1]
            response_text += f"I have 2 options. First is '{m1.get('name', 'Machine')}' at ₹{m1.get('hourly_rate', '')} per hour, and second is '{m2.get('name', 'Machine')}' at ₹{m2.get('hourly_rate', '')} per hour. Which one would you prefer?"
    else:
        response_text = f"मुझे {loc} में {m_type} मिल गया है। "
        if len(machines) == 1:
            m = machines[0]
            response_text += f"'{m.get('name', 'एक मशीन')}' उपलब्ध है। इसका किराया {m.get('hourly_rate', 'उपलब्ध नहीं')} रुपये प्रति घंटे है। क्या मैं इसे आपके लिए बुक कर दूँ?"
        else:
            m1 = machines[0]
            m2 = machines[1]
            response_text += f"मेरे पास 2 विकल्प हैं। पहला '{m1.get('name', 'मशीन')}' {m1.get('hourly_rate', '')} रुपये प्रति घंटे पर, और दूसरा '{m2.get('name', 'मशीन')}' {m2.get('hourly_rate', '')} रुपये प्रति घंटे पर। आप कौन सा चुनना चाहेंगे?"
        
    return response_text

def _get_mock_machines(intent: FarmerRequirementIntent) -> list:
    return [
        {
            "id": "1",
            "name": "John Deere Rotavator",
            "type": "Rotavator",
            "status": "available",
            "hourly_rate": 800,
            "current_location": "Sehore"
        },
        {
            "id": "2",
            "name": "Mahindra Harvester",
            "type": "Harvester",
            "status": "available",
            "hourly_rate": 1500,
            "current_location": "Bhopal"
        }
    ]
