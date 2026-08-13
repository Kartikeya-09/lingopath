def calculate_xp_award(xp_reward: int, errors: int) -> tuple[int, bool]:
    """
    Returns (xp_awarded, is_perfect)
    """
    perfect = (errors == 0)
    bonus = 5 if perfect else 0
    return xp_reward + bonus, perfect
