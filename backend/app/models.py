from sqlalchemy import Column, Integer, DateTime, JSON, Float
from sqlalchemy.sql import func
from app.database import Base


class Drawing(Base):
    __tablename__ = "drawings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pixels = Column(JSON, nullable=False)
    predicted_digit = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
