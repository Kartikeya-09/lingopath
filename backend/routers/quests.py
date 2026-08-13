from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.user import User
from backend.models.progress import Quest, UserQuestProgress, UserStats, XpTransaction
from backend.routers.users import get_current_user
from backend.schemas.gamification import QuestOut

router = APIRouter()

@router.get("/quests", response_model=List[QuestOut])
def get_quests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quests = db.query(Quest).all()
    user_progress = db.query(UserQuestProgress).filter(UserQuestProgress.user_id == current_user.id).all()
    prog_map = {p.quest_id: p for p in user_progress}
    
    result = []
    for q in quests:
        p = prog_map.get(q.id)
        result.append({
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "target_value": q.target_value,
            "xp_reward": q.xp_reward,
            "gem_reward": q.gem_reward,
            "current_value": p.current_value if p else 0,
            "completed": p.completed if p else False,
            "claimed": p.claimed if p else False
        })
    return result

@router.post("/quests/{quest_id}/claim")
def claim_quest(quest_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
        
    prog = db.query(UserQuestProgress).filter_by(user_id=current_user.id, quest_id=quest_id).first()
    if not prog or not prog.completed:
        raise HTTPException(status_code=400, detail="Quest not completed yet")
    if prog.claimed:
        raise HTTPException(status_code=400, detail="Quest already claimed")
        
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    stats.total_xp += quest.xp_reward
    stats.gems += quest.gem_reward
    
    if quest.xp_reward > 0:
        tx = XpTransaction(user_id=current_user.id, amount=quest.xp_reward, reason="quest_reward")
        db.add(tx)
        
    prog.claimed = True
    db.commit()
    
    return {"success": True, "xp_reward": quest.xp_reward, "gem_reward": quest.gem_reward}
