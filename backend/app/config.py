"""
Application Configuration
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    # Application
    APP_NAME: str = "AdaptLearn API"
    APP_VERSION: str = "2.1.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Database — SQLite for zero setup, switch to Postgres later
    DATABASE_URL: str = "sqlite:///./adaptlearn.db"

    # JWT
    SECRET_KEY: str = "change-this-secret-in-production-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # AI services (OpenRouter)
    OPENROUTER_API_KEY: str = ""
    OPENAI_MODEL: str = "google/gemini-2.5-pro"

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS


settings = Settings()
