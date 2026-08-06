import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.sidebar_service import SidebarService
from app.services.feed_service import FeedService
from app.services.trending_service import TrendingService
from app.services.competition_service import CompetitionService
from app.services.user_service import UserService
from app.schemas.home import HomeResponse, HomeFeedSection
from app.schemas.ai_assistant import AIAssistantCardResponse, QuickActionItem


class HomeService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.sidebar_service = SidebarService(session)
        self.feed_service = FeedService(session)
        self.trending_service = TrendingService(session)
        self.comp_service = CompetitionService(session)
        self.user_service = UserService(session)

    async def get_home_page_data(self, user_id: uuid.UUID) -> HomeResponse:
        # 1. Sidebar user summary
        sidebar_summary = await self.sidebar_service.get_sidebar_summary(user_id)

        # 2. Feed posts (Page 1)
        feed_data = await self.feed_service.get_feed(
            page=1, limit=20, current_user_id=user_id
        )
        home_feed = HomeFeedSection(items=feed_data.items, meta=feed_data.meta)

        # 3. Trending
        trending_data = await self.trending_service.get_trending(limit=10)

        # 4. Upcoming competitions
        upcoming_comps = await self.comp_service.get_upcoming_competitions(
            sport=sidebar_summary.sport, limit=5
        )

        # 5. Suggested players
        suggested_players = await self.user_service.get_suggested_players(
            current_user_id=user_id, sport=sidebar_summary.sport, limit=5
        )

        # 6. AI Assistant Widget Card
        ai_card = AIAssistantCardResponse(
            title="Playure AI Sports Coach",
            subtitle="Analyze your stats, draft tournament posts, or plan workout schedules",
            suggested_prompts=[
                "Analyze my recent performance metrics",
                "Suggest sprint exercises for fast bowlers",
                "Draft a post announcing our tournament victory",
            ],
            recent_chats_count=3,
            quick_actions=[
                QuickActionItem(id="q1", label="Performance Analysis", action_type="analyze"),
                QuickActionItem(id="q2", label="Draft Tournament Post", action_type="draft_post"),
                QuickActionItem(id="q3", label="Workout Routine", action_type="workout_plan"),
            ],
        )

        return HomeResponse(
            user_summary=sidebar_summary,
            feed=home_feed,
            trending=trending_data,
            upcoming_competitions=upcoming_comps,
            suggested_players=suggested_players,
            ai_assistant=ai_card,
        )
