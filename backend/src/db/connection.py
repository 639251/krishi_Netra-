"""Database connection and session handling."""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import os

DB_URL = os.environ.get("DATABASE_URL", "sqlite:///./krishinetra.db")

# SQLite specific connect args
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}

engine = create_engine(DB_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for obtaining database sessions in FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables."""
    from .models import (
        PanchayatModel,
        BlockForecastModel,
        PanchayatForecastModel,
        StationModel,
        StationReadingModel,
        AdvisoryModel,
        FeedbackModel,
        WebhookModel,
        ApiKeyModel,
    )
    Base.metadata.create_all(bind=engine)
