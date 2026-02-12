# from pydantic_settings import BaseSettings
# from typing import List
# import json


# class Settings(BaseSettings):
#     DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/digit_recognition"
#     MODEL_PATH: str = "model/model.h5"
#     CORS_ORIGINS: str = '["http://localhost:5173"]'

#     @property
#     def cors_origins_list(self) -> List[str]:
#         return json.loads(self.CORS_ORIGINS)

#     class Config:
#         env_file = ".env"


# settings = Settings()


from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/digit_recognition"
    MODEL_PATH: str = "model/model.h5"
    CORS_ORIGINS: str = '["http://localhost:5173"]'

    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"


settings = Settings()