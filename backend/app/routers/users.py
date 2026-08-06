from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def get_current_user():
    return {
        "status": "success",
        "message": "Users endpoint ready",
        "user": None
    }
