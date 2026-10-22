
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.projects import router as projects_router
from app.routers.auth import router as auth_router
from app.routers.admin_projects import router as admin_projects_router


app = FastAPI(
    title="Developer Portfolio API",
    description="Backend API for my personal developer portfolio.",
    version="1.0.0",
)

allowed_origins = list(
    dict.fromkeys(
        [
            settings.FRONTEND_URL,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8081",
            "http://127.0.0.1:8081",
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router)
app.include_router(auth_router)
app.include_router(admin_projects_router)


@app.get("/")
def root():
    return {
        "message": "Developer Portfolio API is running",
        "status": "healthy",
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
