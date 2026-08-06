from typing import List, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.post import Post
from app.models.hashtag import Hashtag, PostHashtag
from app.models.user import User


class TrendingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_trending_hashtags(self, limit: int = 10) -> List[Tuple[str, int]]:
        stmt = (
            select(Hashtag.name, func.count(PostHashtag.post_id).label("cnt"))
            .join(PostHashtag, Hashtag.id == PostHashtag.hashtag_id)
            .group_by(Hashtag.name)
            .order_by(desc("cnt"))
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        return [(row[0], row[1]) for row in res.all()]

    async def get_trending_sports(self, limit: int = 10) -> List[Tuple[str, int, int]]:
        """
        Returns list of (sport, post_count, athlete_count).
        """
        stmt = (
            select(
                Post.sport,
                func.count(Post.id).label("post_count"),
            )
            .where(Post.sport != None, Post.is_draft == False)
            .group_by(Post.sport)
            .order_by(desc("post_count"))
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        sports_data = res.all()

        results = []
        for row in sports_data:
            sport_name = row[0]
            post_cnt = row[1]

            ath_stmt = (
                select(func.count(User.id))
                .where(User.sport == sport_name, User.role == "athlete")
            )
            ath_res = await self.session.execute(ath_stmt)
            ath_cnt = ath_res.scalar() or 0

            results.append((sport_name, post_cnt, ath_cnt))

        return results
