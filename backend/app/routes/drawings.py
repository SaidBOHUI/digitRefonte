from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database import get_db
from app.models import Drawing
from app.schemas import PredictRequest, PredictResponse, DrawingResponse, DrawingCreate
from app.ml_service import predict_digit

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = predict_digit(request.pixels)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # Save to database
    drawing = Drawing(
        pixels=request.pixels,
        predicted_digit=result["predicted_digit"],
        confidence=result["confidence"],
    )
    db.add(drawing)
    await db.commit()

    return result


@router.post("/drawings", response_model=DrawingResponse, status_code=201)
async def create_drawing(request: DrawingCreate, db: AsyncSession = Depends(get_db)):
    drawing = Drawing(
        pixels=request.pixels,
        predicted_digit=request.resultat,
    )
    db.add(drawing)
    await db.commit()
    await db.refresh(drawing)
    return drawing


@router.get("/drawings", response_model=list[DrawingResponse])
async def get_drawings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Drawing).order_by(Drawing.created_at.desc()))
    return result.scalars().all()


@router.get("/drawings/{drawing_id}", response_model=DrawingResponse)
async def get_drawing(drawing_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Drawing).where(Drawing.id == drawing_id))
    drawing = result.scalar_one_or_none()
    if not drawing:
        raise HTTPException(status_code=404, detail="Drawing not found")
    return drawing


@router.delete("/drawings/{drawing_id}")
async def delete_drawing(drawing_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Drawing).where(Drawing.id == drawing_id))
    drawing = result.scalar_one_or_none()
    if not drawing:
        raise HTTPException(status_code=404, detail="Drawing not found")

    await db.execute(delete(Drawing).where(Drawing.id == drawing_id))
    await db.commit()
    return {"message": "Drawing deleted successfully"}
