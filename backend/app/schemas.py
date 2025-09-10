# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class FlagOut(BaseModel):
    country_name: str
    country_code: str

    class Config:
        orm_mode = True

class GameResultBase(BaseModel):
    date: datetime.date
    success: bool
    attempts: int

class GameResultCreate(BaseModel):
    success: bool
    attempts: int

class GameResultOut(GameResultBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True