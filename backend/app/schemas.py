from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PredictRequest(BaseModel):
    pixels: List[float] = Field(..., min_length=784, max_length=784)


class PredictResponse(BaseModel):
    predicted_digit: int
    confidence: float
    probabilities: List[float]


class DrawingResponse(BaseModel):
    id: int
    predicted_digit: int
    confidence: float
    probabilities: Optional[List[float]] = None
    created_at: datetime

    class Config:
        from_attributes = True
