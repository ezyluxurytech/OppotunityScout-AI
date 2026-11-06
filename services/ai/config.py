from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_ENV: str = "development"
    PORT: int = 8000
    AI_PROVIDER_API_KEY: Optional[str] = None
    INTERNAL_API_KEY: Optional[str] = None
    AI_MODEL: str = "gpt-4o-mini"
    MAX_TOKENS: int = 1500
    REQUEST_TIMEOUT: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
