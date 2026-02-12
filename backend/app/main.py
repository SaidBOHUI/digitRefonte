from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.ml_service import load_model
from app.routes.drawings import router as drawings_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    load_model()
    yield
    # Shutdown (cleanup if needed)


app = FastAPI(
    title="Digit Recognition API",
    description="API for handwritten digit recognition using a Keras model",
    version="1.0.0",
    lifespan=lifespan,
    origins = [
		"https://digiteye.sbohui.fr",
		"http://localhost:5173", # pour tes tests locaux
	]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drawings_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
