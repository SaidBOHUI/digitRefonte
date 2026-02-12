from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


class Drawing(Base):
    __tablename__ = "drawings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pixels = Column(JSON, nullable=False)
    predicted_digit = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    probabilities = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
