from fastapi import APIRouter
from app.api.v1.endpoints import (
    feed,
    posts,
    likes,
    comments,
    search,
    trending,
    competitions,
    collaboration,
    users,
    sidebar,
    home,
    ai_coach,
)

api_router = APIRouter()

api_router.include_router(feed.router, tags=["Feed"])
api_router.include_router(posts.router, tags=["Posts"])
api_router.include_router(likes.router, tags=["Likes"])
api_router.include_router(comments.router, tags=["Comments"])
api_router.include_router(search.router, tags=["Search"])
api_router.include_router(trending.router, tags=["Trending"])
api_router.include_router(competitions.router, tags=["Competitions"])
api_router.include_router(collaboration.router, tags=["Collaboration Hub"])
api_router.include_router(users.router, tags=["Users & Suggestions"])
api_router.include_router(sidebar.router, tags=["Left Sidebar"])
api_router.include_router(home.router, tags=["Home Dashboard"])
api_router.include_router(ai_coach.router, tags=["AI Coach"])
