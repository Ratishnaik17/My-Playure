from app.repositories.base import BaseRepository
from app.repositories.user_repository import UserRepository
from app.repositories.post_repository import PostRepository
from app.repositories.comment_repository import CommentRepository
from app.repositories.like_repository import LikeRepository
from app.repositories.competition_repository import CompetitionRepository
from app.repositories.search_repository import SearchRepository
from app.repositories.trending_repository import TrendingRepository

__all__ = [
    "BaseRepository",
    "UserRepository",
    "PostRepository",
    "CommentRepository",
    "LikeRepository",
    "CompetitionRepository",
    "SearchRepository",
    "TrendingRepository",
]
