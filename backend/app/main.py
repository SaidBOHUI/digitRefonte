from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import Base
from app.ml_service import load_model
from app.routes.drawings import router as drawings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load model + create tables
    load_model(settings.MODEL_PATH)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created")
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="Digit Recognition API",
    description="MNIST digit recognition with Keras MLP",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drawings_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
