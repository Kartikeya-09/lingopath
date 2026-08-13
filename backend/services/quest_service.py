from sqlalchemy.orm import Session
from backend.models.progress import Quest, UserQuestProgress

def increment_quest_progress(db: Session, user_id: int):
    quests = db.query(Quest).all()
    for q in quests:
        prog = db.query(UserQuestProgress).filter_by(user_id=user_id, quest_id=q.id).first()
        if not prog:
            prog = UserQuestProgress(user_id=user_id, quest_id=q.id, current_value=0)
            db.add(prog)
        
        if not prog.completed:
            prog.current_value += 1
            if prog.current_value >= q.target_value:
                prog.current_value = q.target_value
                prog.completed = True
                
    db.commit()
