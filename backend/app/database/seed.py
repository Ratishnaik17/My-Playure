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

        session.add_all([user_main, user_2, user_3, user_coach, user_academy])
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
            user_id=user_main.id,
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
            user_id=user_main.id,
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

        await session.commit()
        print("Database seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
