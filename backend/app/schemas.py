from pydantic import BaseModel, Field
from datetime import datetime


class PredictRequest(BaseModel):
    pixels: list[float] = Field(..., min_length=784, max_length=784, description="784 grayscale pixel values (28x28)")


class PredictResponse(BaseModel):
    predicted_digit: int
    confidence: float
    probabilities: list[float]


class DrawingResponse(BaseModel):
    id: int
    predicted_digit: int
    confidence: float | None
    created_at: datetime

    class Config:
        from_attributes = True


class DrawingCreate(BaseModel):
    pixels: list[float] = Field(..., min_length=784, max_length=784)
    resultat: int = Field(..., ge=0, le=9)
