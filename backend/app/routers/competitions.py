from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_competitions():
    return {
        "status": "success",
        "message": "Competitions endpoint ready",
        "competitions": []
    }
