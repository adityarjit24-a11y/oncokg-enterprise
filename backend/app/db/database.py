from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL (Production mein isko .env se lena)
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db" # Agar tum PostgreSQL/MySQL use kar rahe ho toh wahan ka URL daalo

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Ye wahi function hai jo auth.py use kar raha hai
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()