import uuid
from typing import List
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.replay_repository import RePlayListingRepository
from app.schemas.replay import RePlayListingCreate, RePlayListingResponse
from app.models.replay import RePlayListing


class RePlayService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.replay_repo = RePlayListingRepository(session)

    async def get_all_listings(self) -> List[RePlayListingResponse]:
        listings = await self.replay_repo.get_all_with_user()
        return [RePlayListingResponse.model_validate(item) for item in listings]

    async def create_listing(
        self, user_id: uuid.UUID, listing_in: RePlayListingCreate
    ) -> RePlayListingResponse:
        data = listing_in.model_dump()
        data["user_id"] = user_id
        
        listing = RePlayListing(**data)
        created_listing = await self.replay_repo.create(listing)
        await self.session.commit()
        
        # Load with eager loaded user details
        res = await self.replay_repo.session.execute(
            select(RePlayListing)
            .options(joinedload(RePlayListing.user))
            .where(RePlayListing.id == created_listing.id)
        )
        final_listing = res.scalars().first()
        return RePlayListingResponse.model_validate(final_listing)
