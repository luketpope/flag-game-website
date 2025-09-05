from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth
from app.database import Base, engine
from . import models, schemas

from sqlalchemy.orm import Session
from .database import get_db

import pytz
import datetime
import random

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # frontend URL
    allow_credentials=True,  # needed for cookies/JWT
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth")

@app.get("/daily", response_model=schemas.FlagOut)
def get_daily_challenge(db: Session = Depends(get_db)):
    flags = db.query(models.Flag).all()
    if not flags:
        return {"country_name": "No Flags", "country_code": "xx"}
    
    tz = pytz.timezone("UTC")
    today = datetime.datetime.now(tz).date()
    seed = today.toordinal()
    index = seed % len(flags)
    daily_flag = db.query(models.Flag).filter_by(shuffled_index=index).first()

    return daily_flag