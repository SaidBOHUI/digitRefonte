from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models import Drawing
from app.schemas import PredictRequest, PredictResponse, DrawingResponse
from app.ml_service import predict_digit

router = APIRouter(prefix="/api", tags=["drawings"])


@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest, db: AsyncSession = Depends(get_db)):
    result = predict_digit(request.pixels)

    drawing = Drawing(
        pixels=request.pixels,
        predicted_digit=result["predicted_digit"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
    )
    db.add(drawing)
    await db.commit()
    await db.refresh(drawing)

    return result


@router.get("/drawings", response_model=list[DrawingResponse])
async def get_drawings(
    limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    query = select(Drawing).order_by(desc(Drawing.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
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
    await db.delete(drawing)
    await db.commit()
    return {"detail": "Drawing deleted"}
