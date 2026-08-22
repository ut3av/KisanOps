from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.voice_routes import router as voice_router

app = FastAPI(
    title="KisanOps Vernacular Voice Assistant API",
    description="Multilingual Voice & Vernacular AI Assistant for AgriFlow (KisanOps)",
    version="1.0.0"
)

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict to frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Voice Assistant API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
