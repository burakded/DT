from uuid import UUID

from models.databases.supabase.brains import BrainUpdatableProperties
from models import BrainEntity, get_supabase_db


def update_brain_base_prompt_by_id(brain_id: UUID, base_prompt: str) -> BrainEntity:
    """Update a prompt by id"""
    supabase_db = get_supabase_db()

    return supabase_db.update_brain_base_prompt_by_id(brain_id, base_prompt)
