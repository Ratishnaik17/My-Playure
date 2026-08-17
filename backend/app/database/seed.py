import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.database.base import Base
from app.models.user import User
from app.models.post import Post, PostMedia
from app.models.comment import Comment
from app.models.like import Like
from app.models.saved_post import SavedPost
from app.models.follower import Follower
from app.models.hashtag import Hashtag, PostHashtag
from app.models.competition import Competition
from app.models.replay import RePlayListing
from app.core.security import DEFAULT_TEST_USER_ID


async def get_working_engine():
    # Attempt primary PostgreSQL connection
    try:
        pg_engine = create_async_engine(settings.DATABASE_URL, echo=False)
        async with pg_engine.begin() as conn:
            await conn.run_sync(lambda c: None)
        print(f"Connected to PostgreSQL database at {settings.DATABASE_URL}")
        return pg_engine
    except Exception as e:
        print(f"PostgreSQL connection failed ({e}). Falling back to SQLite database at {settings.SQLITE_FALLBACK_URL}")
        sqlite_engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False)
        return sqlite_engine


async def seed_database():
    target_engine = await get_working_engine()

    print("Initializing database schema...")
    async with target_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=target_engine, expire_on_commit=False)

    async with session_factory() as session:
        # Check if database is already seeded
        existing_users = await session.execute(select(User))
        if existing_users.scalars().first():
            print("Database already contains data. Skipping seed step.")
            return

        print("Seeding database with initial mock data for Playure Homepage...")

        # 1. Users
        user_main = User(
            id=DEFAULT_TEST_USER_ID,
            full_name="Ratish Naik",
            username="ratish_naik",
            email="ratish@playure.com",
            profile_image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
            bio='{"about": "International Athlete & Cricket Captain. Passionate about fitness, mental toughness, and youth mentoring.", "website": "playure.com/ratishnaik", "attributes": ["Right Hand Batsman", "Right Arm Off Break", "All Rounder"], "bioDetails": {"age": "24", "height": "5\'10\\"", "weight": "72 kg", "playingSince": "2012", "languages": "English, Hindi, Gujarati", "education": "UVCE"}, "skills": [{"name": "Batting", "percentage": 88}, {"name": "Balling", "percentage": 88}, {"name": "fielding", "percentage": 88}, {"name": "hockey", "percentage": 85}], "highlights": [{"icon": "🏆", "text": "RCB cup winner"}, {"icon": "🏆", "text": "RCB cup winner 2"}], "experience": [{"id": 1, "team": "Rcb", "role": "ALL ROUNDER", "period": "Jan 2023 - presentt", "description": "Good"}], "posts": []}',
            role="athlete",
            sport="Cricket",
            state="India",
            city="Bengaluru",
            verified=True,
            followers_count=1205,
            following_count=325,
            profile_views=8930,
        )

        user_virat = User(
            id=uuid.uuid4(),
            full_name="Virat Kohli",
            username="virat_kohli",
            email="virat@playure.com",
            profile_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
            bio="International Athlete & Cricket Captain. Passionate about fitness, mental toughness, and youth mentoring.",
            role="athlete",
            sport="Cricket",
            state="Delhi",
            city="New Delhi",
            verified=True,
            followers_count=12400,
            following_count=420,
            profile_views=8930,
        )

        user_2 = User(
            id=uuid.uuid4(),
            full_name="Neeraj Chopra",
            username="neeraj_javelin",
            email="neeraj@playure.com",
            profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
            bio="Olympic Gold Medalist Javelin Thrower. Representing India worldwide 🇮🇳",
            role="athlete",
            sport="Athletics",
            state="Haryana",
            city="Panipat",
            verified=True,
            followers_count=9800,
            following_count=180,
            profile_views=5400,
        )

        user_3 = User(
            id=uuid.uuid4(),
            full_name="PV Sindhu",
            username="pvsindhu1",
            email="sindhu@playure.com",
            profile_image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=80",
            bio="Badminton World Champion | 2x Olympic Medalist",
            role="athlete",
            sport="Badminton",
            state="Telangana",
            city="Hyderabad",
            verified=True,
            followers_count=8500,
            following_count=210,
            profile_views=6100,
        )

        user_coach = User(
            id=uuid.uuid4(),
            full_name="Ravi Shastri",
            username="coach_shastri",
            email="shastri@playure.com",
            profile_image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
            bio="Senior High Performance Cricket Coach & Tactical Strategist",
            role="coach",
            sport="Cricket",
            state="Maharashtra",
            city="Mumbai",
            verified=True,
            followers_count=6200,
            following_count=310,
            profile_views=3100,
        )

        user_academy = User(
            id=uuid.uuid4(),
            full_name="Gopichand Badminton Academy",
            username="gopichand_academy",
            email="info@gopichandacademy.com",
            profile_image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop&q=80",
            cover_image="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=80",
            bio="Premier Badminton Training Center nurturing Olympic champions",
            role="academy",
            sport="Badminton",
            state="Telangana",
            city="Hyderabad",
            verified=True,
            followers_count=15400,
            following_count=45,
            profile_views=12300,
        )

        # RePlay Marketplace Sellers
        user_naresh = User(
            id=uuid.uuid4(),
            full_name="Naresh Kumar",
            username="naresh_k",
            email="naresh@playure.com",
            profile_image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Cricket",
            state="Telangana",
            city="Hyderabad",
            verified=True,
        )
        user_divya = User(
            id=uuid.uuid4(),
            full_name="Divya Nair",
            username="divya_n",
            email="divya@playure.com",
            profile_image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Volleyball",
            state="Tamil Nadu",
            city="Chennai",
            verified=True,
        )
        user_rohan = User(
            id=uuid.uuid4(),
            full_name="Rohan Joshi",
            username="rohan_j",
            email="rohan@playure.com",
            profile_image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
            role="coach",
            sport="Football",
            state="Maharashtra",
            city="Pune",
            verified=True,
        )
        user_vikrant = User(
            id=uuid.uuid4(),
            full_name="Vikrant Mehta",
            username="vikrant_m",
            email="vikrant@playure.com",
            profile_image="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Running",
            state="Telangana",
            city="Hyderabad",
            verified=True,
        )
        user_kabir = User(
            id=uuid.uuid4(),
            full_name="Kabir Singh",
            username="kabir_s",
            email="kabir@playure.com",
            profile_image="https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Basketball",
            state="Delhi",
            city="New Delhi",
            verified=True,
        )
        user_subhash = User(
            id=uuid.uuid4(),
            full_name="Subhash Bose",
            username="subhash_b",
            email="subhash@playure.com",
            profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Football",
            state="West Bengal",
            city="Kolkata",
            verified=True,
        )
        user_priya = User(
            id=uuid.uuid4(),
            full_name="Priya Patel",
            username="priya_p",
            email="priya@playure.com",
            profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Badminton",
            state="Maharashtra",
            city="Mumbai",
            verified=True,
        )
        user_arjun_s = User(
            id=uuid.uuid4(),
            full_name="Arjun Sharma",
            username="arjun_s",
            email="arjuns@playure.com",
            profile_image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            role="athlete",
            sport="Cricket",
            state="Karnataka",
            city="Bangalore",
            verified=True,
        )

        session.add_all([
            user_main, user_virat, user_2, user_3, user_coach, user_academy,
            user_naresh, user_divya, user_rohan, user_vikrant,
            user_kabir, user_subhash, user_priya, user_arjun_s
        ])
        await session.flush()

        # 2. Followers
        f1 = Follower(follower_id=user_main.id, following_id=user_2.id)
        f2 = Follower(follower_id=user_main.id, following_id=user_3.id)
        f3 = Follower(follower_id=user_2.id, following_id=user_main.id)
        session.add_all([f1, f2, f3])

        # 3. Hashtags
        tag1 = Hashtag(id=uuid.uuid4(), name="cricket")
        tag2 = Hashtag(id=uuid.uuid4(), name="javelin")
        tag3 = Hashtag(id=uuid.uuid4(), name="badminton")
        tag4 = Hashtag(id=uuid.uuid4(), name="playurechampions")
        tag5 = Hashtag(id=uuid.uuid4(), name="fitnessjourney")
        session.add_all([tag1, tag2, tag3, tag4, tag5])
        await session.flush()

        # 4. Posts
        post1 = Post(
            id=uuid.uuid4(),
            user_id=user_virat.id,
            content="Heavy net session today at Chinnaswamy! Focused on front-foot defense against high pace. Work hard in silence, let your results speak. #cricket #fitnessjourney #playurechampions",
            post_type="achievement",
            sport="Cricket",
            achievement_type="Century Record",
            location="Bengaluru, Karnataka",
            created_at=datetime.now(timezone.utc) - timedelta(hours=2),
        )

        media1_1 = PostMedia(
            id=uuid.uuid4(),
            post_id=post1.id,
            media_type="image",
            media_url="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
            sort_order=0,
        )
        media1_2 = PostMedia(
            id=uuid.uuid4(),
            post_id=post1.id,
            media_type="image",
            media_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
            sort_order=1,
        )

        post2 = Post(
            id=uuid.uuid4(),
            user_id=user_2.id,
            content="Crossed 89.20 meters in today's throwing drills! Season preparation is peaking at the right time. Thankful for all the support 🇮🇳 #javelin #playurechampions",
            post_type="achievement",
            sport="Athletics",
            achievement_type="Personal Best",
            location="Paris, France",
            created_at=datetime.now(timezone.utc) - timedelta(hours=5),
        )

        media2 = PostMedia(
            id=uuid.uuid4(),
            post_id=post2.id,
            media_type="image",
            media_url="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
            sort_order=0,
        )

        post3 = Post(
            id=uuid.uuid4(),
            user_id=user_3.id,
            content="Checked in at Gopichand Badminton Academy for the All-India Championship warm-up session! Match starts tomorrow. #badminton",
            post_type="check_in",
            sport="Badminton",
            location="Hyderabad, Telangana",
            created_at=datetime.now(timezone.utc) - timedelta(hours=10),
        )

        post_draft = Post(
            id=uuid.uuid4(),
            user_id=user_main.id,
            content="Draft notes for upcoming fitness masterclass series for young athletes.",
            post_type="normal",
            sport="Cricket",
            is_draft=True,
            created_at=datetime.now(timezone.utc) - timedelta(days=1),
        )

        session.add_all([post1, media1_1, media1_2, post2, media2, post3, post_draft])
        await session.flush()

        # Post Hashtag links
        session.add_all([
            PostHashtag(post_id=post1.id, hashtag_id=tag1.id),
            PostHashtag(post_id=post1.id, hashtag_id=tag5.id),
            PostHashtag(post_id=post1.id, hashtag_id=tag4.id),
            PostHashtag(post_id=post2.id, hashtag_id=tag2.id),
            PostHashtag(post_id=post2.id, hashtag_id=tag4.id),
            PostHashtag(post_id=post3.id, hashtag_id=tag3.id),
        ])

        # 5. Likes
        l1 = Like(user_id=user_2.id, post_id=post1.id)
        l2 = Like(user_id=user_3.id, post_id=post1.id)
        l3 = Like(user_id=user_main.id, post_id=post2.id)
        session.add_all([l1, l2, l3])

        # 6. Comments (with nested reply)
        c1 = Comment(
            id=uuid.uuid4(),
            post_id=post1.id,
            user_id=user_coach.id,
            comment="Outstanding elbow positioning on those cover drives! Keep pushing the intensity.",
            created_at=datetime.now(timezone.utc) - timedelta(hours=1, minutes=30),
        )
        await session.flush()

        c1_reply = Comment(
            id=uuid.uuid4(),
            post_id=post1.id,
            user_id=user_virat.id,
            parent_comment_id=c1.id,
            comment="Thanks Coach! Working closely on foot movement speed.",
            created_at=datetime.now(timezone.utc) - timedelta(hours=1),
        )
        session.add(c1_reply)

        # 7. Saved Posts
        session.add(SavedPost(user_id=user_main.id, post_id=post2.id))

        # 8. Competitions
        comp1 = Competition(
            id=uuid.uuid4(),
            title="All-India Premier League T20 Trials 2026",
            sport="Cricket",
            organizer="BCCI Development Board",
            location="M. Chinnaswamy Stadium, Bengaluru",
            registration_deadline=datetime.now(timezone.utc) + timedelta(days=14),
            start_date=datetime.now(timezone.utc) + timedelta(days=20),
            end_date=datetime.now(timezone.utc) + timedelta(days=35),
            prize_pool="₹25,00,000",
            status="upcoming",
            banner_image="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
        )

        comp2 = Competition(
            id=uuid.uuid4(),
            title="National Badminton Championship 2026",
            sport="Badminton",
            organizer="Badminton Association of India",
            location="Gachibowli Indoor Stadium, Hyderabad",
            registration_deadline=datetime.now(timezone.utc) + timedelta(days=7),
            start_date=datetime.now(timezone.utc) + timedelta(days=12),
            end_date=datetime.now(timezone.utc) + timedelta(days=16),
            prize_pool="₹10,00,000",
            status="upcoming",
            banner_image="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=80",
        )

        comp3 = Competition(
            id=uuid.uuid4(),
            title="Indian Open Track & Field Grand Prix",
            sport="Athletics",
            organizer="Athletics Federation of India",
            location="JLN Stadium, New Delhi",
            registration_deadline=datetime.now(timezone.utc) + timedelta(days=21),
            start_date=datetime.now(timezone.utc) + timedelta(days=30),
            end_date=datetime.now(timezone.utc) + timedelta(days=32),
            prize_pool="₹15,00,000",
            status="upcoming",
            banner_image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
        )

        session.add_all([comp1, comp2, comp3])

        # 9. RePlay Listings
        l1 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_naresh.id,
            name="Nivia Cricket Leather Balls (Pack of 6)",
            sport="Cricket",
            category="Cricket Balls",
            condition="Good",
            price=0.0,
            is_free=True,
            location="Hyderabad, TS",
            description="Box of 6 four-piece leather cricket balls. Slightly used for nets practice (about 5-10 overs each). Great for academy practice sessions.",
            image_url=None,
        )
        l2 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_divya.id,
            name="Cosco Super Volleyball",
            sport="Volleyball",
            category="Volleyballs",
            condition="Like New",
            price=0.0,
            is_free=True,
            location="Chennai, TN",
            description="Premium quality outdoor volleyball. Used only twice, holding air perfectly. Selling as I have upgraded.",
            image_url=None,
        )
        l3 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_rohan.id,
            name="Kipsta Football Size 5",
            sport="Football",
            category="Footballs",
            condition="Excellent",
            price=0.0,
            is_free=True,
            location="Pune, MH",
            description="Official size 5 Kipsta football. Very durable, suitable for both grass and artificial turf. Normal signs of use.",
            image_url=None,
        )
        l4 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_vikrant.id,
            name="Adidas Ultraboost Running Shoes",
            sport="Running",
            category="Footwear",
            condition="Excellent",
            price=5500.0,
            is_free=False,
            location="Hyderabad, TS",
            description="Adidas Ultraboost running shoes (Size UK 9). Exceptionally comfortable boost cushioning. Used for under 50km on track.",
            image_url=None,
        )
        l5 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_kabir.id,
            name="Decathlon Kipsta Basketball",
            sport="Basketball",
            category="Basketballs",
            condition="Good",
            price=800.0,
            is_free=False,
            location="Delhi, NCR",
            description="Size 7 basketball from Decathlon. Excellent grip and bounce, ideal for outdoor asphalt courts.",
            image_url=None,
        )
        l6 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_subhash.id,
            name="Nike Mercurial Football Boots",
            sport="Football",
            category="Footwear",
            condition="Good",
            price=3000.0,
            is_free=False,
            location="Kolkata, WB",
            description="Nike Mercurial multi-ground football studs (Size UK 8). Lightweight speed-focused design. Studs are in great shape.",
            image_url=None,
        )
        l7 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_priya.id,
            name="Yonex Nanoray Badminton Racket",
            sport="Badminton",
            category="Rackets",
            condition="Like New",
            price=2200.0,
            is_free=False,
            location="Mumbai, MH",
            description="Lightweight head-light badminton racket. Strung with BG65 titanium strings at 24 lbs. No scratches or paint chips.",
            image_url=None,
        )
        l8 = RePlayListing(
            id=uuid.uuid4(),
            user_id=user_arjun_s.id,
            name="SS English Willow Cricket Bat",
            sport="Cricket",
            category="Bats",
            condition="Excellent",
            price=4500.0,
            is_free=False,
            location="Bangalore, KA",
            description="Professional grade SS English Willow cricket bat. Standard short handle size. Balanced sweet spot, fully knocked and oiled.",
            image_url=None,
        )

        session.add_all([l1, l2, l3, l4, l5, l6, l7, l8])

        await session.commit()
        print("Database seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
