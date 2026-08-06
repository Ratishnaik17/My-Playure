import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router
from app.database.session import engine
from sqlalchemy import text
from app.database.base import Base
import app.models  # Ensure all SQLAlchemy models are registered


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Playure FastAPI Backend Application...")
    # Create static uploads directory
    os.makedirs("uploads", exist_ok=True)

    # Auto-create tables in local development mode
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        columns = [
            "ALTER TABLE competitions ADD COLUMN level VARCHAR(50)",
            "ALTER TABLE competitions ADD COLUMN description TEXT",
            "ALTER TABLE competitions ADD COLUMN registration_deadline TIMESTAMP",
            "ALTER TABLE competitions ADD COLUMN start_date TIMESTAMP",
            "ALTER TABLE competitions ADD COLUMN end_date TIMESTAMP",
            "ALTER TABLE competitions ADD COLUMN prize_pool VARCHAR(100)",
            "ALTER TABLE competitions ADD COLUMN registration_fee VARCHAR(50)",
            "ALTER TABLE competitions ADD COLUMN max_participants VARCHAR(50)",
            "ALTER TABLE competitions ADD COLUMN contact_info VARCHAR(150)",
            "ALTER TABLE competitions ADD COLUMN status VARCHAR(30)",
            "ALTER TABLE competitions ADD COLUMN banner_image VARCHAR(500)",
        ]
        for sql in columns:
            try:
                await conn.execute(text(sql))
            except Exception:
                pass

    logger.info("Database schema initialized successfully.")

    yield

    logger.info("Shutting down Playure Backend Application...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Scalable Clean-Architecture REST API for Playure Homepage (Sports Networking Platform)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Uploaded Media
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/", tags=["Health"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENV,
    }


# Include Routers with versioning /api/v1 as well as /api alias
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router, prefix="/api")
