from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    results = relationship("GameResult", back_populates="user")

class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, index=True)
    country_name = Column(String, unique=True, index=True, nullable=False)
    country_code = Column(String(2), unique=True, nullable=False)  # ISO alpha-2
    shuffled_index = Column(Integer, unique=True)

class GameResult(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, default=datetime.date.today, nullable=False)
    success = Column(Boolean, default=False)
    attempts = Column(Integer, nullable=False)

    user = relationship("User", back_populates="results")