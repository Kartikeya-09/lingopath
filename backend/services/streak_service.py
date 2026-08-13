from datetime import date

def calculate_streak(last_activity_date: date | None, current_streak: int, today: date) -> tuple[int, bool]:
    """
    Returns (new_streak, is_updated)
    """
    if last_activity_date is None:
        return 1, True
        
    delta_days = (today - last_activity_date).days
    
    if delta_days == 0:
        return current_streak, False
    elif delta_days == 1:
        return current_streak + 1, True
    else:
        return 1, True
