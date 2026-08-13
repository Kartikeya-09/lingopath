from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.progress import UserStats
from backend.routers.users import get_current_user
from backend.services.heart_service import refill_hearts

router = APIRouter()

@router.post("/hearts/refill")
def refill_hearts_route(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not found")
        
    stats.hearts = refill_hearts()
    db.commit()
    return {"hearts": stats.hearts}
