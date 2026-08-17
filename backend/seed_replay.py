import asyncio
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.database.base import Base
from app.models.user import User
from app.models.replay import RePlayListing


async def get_working_engine():
    try:
        sqlite_engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False)
        return sqlite_engine
    except Exception as e:
        print(f"Failed to load engine: {e}")
        raise


async def seed_replay_listings():
    target_engine = await get_working_engine()

    print("Ensuring replay_listings table exists...")
    async with target_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=target_engine, expire_on_commit=False)

    async with session_factory() as session:
        # Check if listings already exist
        existing_listings = await session.execute(select(RePlayListing))
        if existing_listings.scalars().first():
            print("RePlay listings already seeded. Skipping.")
            return

        print("Seeding RePlay sellers and listings...")

        # Seller details
        sellers_info = [
            ("Naresh Kumar", "naresh_k", "naresh@playure.com", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", "Cricket", "Telangana", "Hyderabad"),
            ("Divya Nair", "divya_n", "divya@playure.com", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", "Volleyball", "Tamil Nadu", "Chennai"),
            ("Rohan Joshi", "rohan_j", "rohan@playure.com", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", "Football", "Maharashtra", "Pune"),
            ("Vikrant Mehta", "vikrant_m", "vikrant@playure.com", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80", "Running", "Telangana", "Hyderabad"),
            ("Kabir Singh", "kabir_s", "kabir@playure.com", "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&auto=format&fit=crop&q=80", "Basketball", "Delhi", "New Delhi"),
            ("Subhash Bose", "subhash_b", "subhash@playure.com", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", "Football", "West Bengal", "Kolkata"),
            ("Priya Patel", "priya_p", "priya@playure.com", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", "Badminton", "Maharashtra", "Mumbai"),
            ("Arjun Sharma", "arjun_s", "arjuns@playure.com", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", "Cricket", "Karnataka", "Bangalore"),
        ]

        sellers = {}
        for name, username, email, img, sport, state, city in sellers_info:
            # Query if user exists
            res = await session.execute(select(User).where(User.username == username))
            user = res.scalars().first()
            if not user:
                user = User(
                    id=uuid.uuid4(),
                    full_name=name,
                    username=username,
                    email=email,
                    profile_image=img,
                    role="athlete",
                    sport=sport,
                    state=state,
                    city=city,
                    verified=True
                )
                session.add(user)
                await session.flush()
            sellers[username] = user

        # Create RePlay listings
        listings = [
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["naresh_k"].id,
                name="Nivia Cricket Leather Balls (Pack of 6)",
                sport="Cricket",
                category="Cricket Balls",
                condition="Good",
                price=0.0,
                is_free=True,
                location="Hyderabad, TS",
                description="Box of 6 four-piece leather cricket balls. Slightly used for nets practice (about 5-10 overs each). Great for academy practice sessions.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["divya_n"].id,
                name="Cosco Super Volleyball",
                sport="Volleyball",
                category="Volleyballs",
                condition="Like New",
                price=0.0,
                is_free=True,
                location="Chennai, TN",
                description="Premium quality outdoor volleyball. Used only twice, holding air perfectly. Selling as I have upgraded.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["rohan_j"].id,
                name="Kipsta Football Size 5",
                sport="Football",
                category="Footballs",
                condition="Excellent",
                price=0.0,
                is_free=True,
                location="Pune, MH",
                description="Official size 5 Kipsta football. Very durable, suitable for both grass and artificial turf. Normal signs of use.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["vikrant_m"].id,
                name="Adidas Ultraboost Running Shoes",
                sport="Running",
                category="Footwear",
                condition="Excellent",
                price=5500.0,
                is_free=False,
                location="Hyderabad, TS",
                description="Adidas Ultraboost running shoes (Size UK 9). Exceptionally comfortable boost cushioning. Used for under 50km on track.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["kabir_s"].id,
                name="Decathlon Kipsta Basketball",
                sport="Basketball",
                category="Basketballs",
                condition="Good",
                price=800.0,
                is_free=False,
                location="Delhi, NCR",
                description="Size 7 basketball from Decathlon. Excellent grip and bounce, ideal for outdoor asphalt courts.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["subhash_b"].id,
                name="Nike Mercurial Football Boots",
                sport="Football",
                category="Footwear",
                condition="Good",
                price=3000.0,
                is_free=False,
                location="Kolkata, WB",
                description="Nike Mercurial multi-ground football studs (Size UK 8). Lightweight speed-focused design. Studs are in great shape.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["priya_p"].id,
                name="Yonex Nanoray Badminton Racket",
                sport="Badminton",
                category="Rackets",
                condition="Like New",
                price=2200.0,
                is_free=False,
                location="Mumbai, MH",
                description="Lightweight head-light badminton racket. Strung with BG65 titanium strings at 24 lbs. No scratches or paint chips.",
                image_url=None,
            ),
            RePlayListing(
                id=uuid.uuid4(),
                user_id=sellers["arjun_s"].id,
                name="SS English Willow Cricket Bat",
                sport="Cricket",
                category="Bats",
                condition="Excellent",
                price=4500.0,
                is_free=False,
                location="Bangalore, KA",
                description="Professional grade SS English Willow cricket bat. Standard short handle size. Balanced sweet spot, fully knocked and oiled.",
                image_url=None,
            ),
        ]

        session.add_all(listings)
        await session.commit()
        print("Successfully seeded RePlay marketplace listings!")


if __name__ == "__main__":
    asyncio.run(seed_replay_listings())
