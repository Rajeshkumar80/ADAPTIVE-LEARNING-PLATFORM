"""
AdaptLearn API — FastAPI Application Entry
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import admin, ai, auth, journal, notifications, planner, student, tests
from app.seed import seed_database

# Ensure all models are imported for table creation
import app.models  # noqa: F401

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger("adaptlearn")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Database: {settings.DATABASE_URL}")

    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("✓ Database tables ready")

    # Seed initial data
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Seeding error: {e}")
    finally:
        db.close()

    logger.info(f"✓ API ready at http://localhost:8000")
    logger.info(f"✓ Docs at http://localhost:8000/docs")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered adaptive learning platform for VTU students",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(tests.router, prefix="/api/tests", tags=["Tests"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(planner.router, prefix="/api/planner", tags=["Planner"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.exception_handler(404)
async def not_found(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
