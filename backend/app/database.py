"""
Database Configuration and Session Management.
Supports both SQLite (dev) and PostgreSQL (production).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Connection args differ by backend
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Pool settings for PostgreSQL
pool_kwargs = {}
if not settings.DATABASE_URL.startswith("sqlite"):
    pool_kwargs = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,  # verify connections before use
    }

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
    **pool_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yield a database session and ensure it gets closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
