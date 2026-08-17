import asyncio
from sqlalchemy import update
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.models.replay import RePlayListing


async def update_all_listings():
    sqlite_engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False)
    session_factory = async_sessionmaker(bind=sqlite_engine, expire_on_commit=False)

    async with session_factory() as session:
        print("Updating existing RePlay listings to use the default image...")
        stmt = update(RePlayListing).values(image_url=None)
        await session.execute(stmt)
        await session.commit()
        print("Successfully updated all existing listings' image URLs in the database to NULL!")


if __name__ == "__main__":
    asyncio.run(update_all_listings())
