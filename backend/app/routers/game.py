from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user
import datetime

router = APIRouter()

@router.post("/results", response_model=schemas.GameResultOut)
def submit_result(result: schemas.GameResultCreate, 
                  db: Session = Depends(get_db), 
                  current_user: models.User = Depends(get_current_user)):
                
    today = datetime.date.today()

    existing = db.query(models.GameResult).filter_by(user_id=current_user.id, date=today).first()

    if existing:
        raise HTTPException(status_code=400, detail="Result for today already submitted")

    game_result = models.GameResult(
        user_id=current_user.id,
        date=today,
        success=result.success,
        attempts=result.attempts
    )

    db.add(game_result)
    db.commit()
    db.refresh(game_result)
    return game_result

@router.get("/results/today", response_model=schemas.GameResultOut)
def get_today_result(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    today = datetime.date.today()
    try:
        result = (
            db.query(models.GameResult)
            .filter_by(user_id=current_user.id, date=today)
            .first()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")

    if result is None:
        raise HTTPException(status_code=404, detail="No result found for today")
    return result