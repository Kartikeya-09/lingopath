from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
