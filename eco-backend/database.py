from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔹 PostgreSQL Database URL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:240505@localhost:5432/ecolens_db"

# 🔹 Create Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True  # Optional: shows SQL queries in terminal (good for debugging)
)

# 🔹 Create Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔹 Base Model
Base = declarative_base()


# 🔹 Dependency (VERY IMPORTANT for FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
