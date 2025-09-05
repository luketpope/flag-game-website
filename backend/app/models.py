from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, index=True)
    country_name = Column(String, unique=True, index=True, nullable=False)
    country_code = Column(String(2), unique=True, nullable=False)  # ISO alpha-2
    shuffled_index = Column(Integer, unique=True)