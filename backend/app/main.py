from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models

from .routes import (
    auth,
    profile,
    resume,
    placement,
    jobs,
    interviews,
    dashboard
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="CareerGenAI",
    description="AI-Powered Career Guidance and Placement Platform",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROUTES
# ==========================================

app.include_router(auth.router)

app.include_router(profile.router)

app.include_router(resume.router)

app.include_router(placement.router)

app.include_router(jobs.router)

app.include_router(interviews.router)

app.include_router(dashboard.router)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Welcome to CareerGenAI",
        "status": "running"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }