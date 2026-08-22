from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.voice_routes import router as voice_router
from routes.yukti_routes import router as yukti_router

app = FastAPI(
    title="KisanOps Vernacular Voice & Yukti AI Assistant API",
    description="Multilingual Voice & Agricultural Operations Assistant for AgriFlow (KisanOps)",
    version="2.6.0"
)

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to configured frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router, prefix="/api")
app.include_router(yukti_router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KisanOps Voice AI",
        "version": "2.6.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
