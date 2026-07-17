from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OncoKG Enterprise API"
    API_V1_STR: str = "/api/v1"
    
    # Neo4j Settings (Default credentials)
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()