from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.trending_repository import TrendingRepository
from app.schemas.trending import TrendingResponse, TrendingHashtagItem, TrendingSportItem


class TrendingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.trending_repo = TrendingRepository(session)

    async def get_trending(self, limit: int = 10) -> TrendingResponse:
        hashtags_raw = await self.trending_repo.get_trending_hashtags(limit=limit)
        sports_raw = await self.trending_repo.get_trending_sports(limit=limit)

        trending_hashtags = [
            TrendingHashtagItem(name=h[0], post_count=h[1]) for h in hashtags_raw
        ]
        trending_sports = [
            TrendingSportItem(sport=s[0], post_count=s[1], active_athletes_count=s[2])
            for s in sports_raw
        ]

        return TrendingResponse(
            trending_hashtags=trending_hashtags,
            trending_sports=trending_sports,
        )
