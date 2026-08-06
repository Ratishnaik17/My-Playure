import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database.seed import seed_database
from app.core.security import DEFAULT_TEST_USER_ID


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    await seed_database()


@pytest.mark.asyncio
async def test_health_and_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        root_res = await ac.get("/")
        assert root_res.status_code == 200
        assert "Playure API" in root_res.json()["service"]


@pytest.mark.asyncio
async def test_get_feed():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/feed?page=1&limit=10")
        assert res.status_code == 200
        data = res.json()
        assert "items" in data
        assert "meta" in data
        assert len(data["items"]) >= 1


@pytest.mark.asyncio
async def test_get_feed_filtered_by_sport():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/feed?sport=Cricket")
        assert res.status_code == 200
        data = res.json()
        assert all(post["sport"] == "Cricket" for post in data["items"])


@pytest.mark.asyncio
async def test_create_get_update_delete_post():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create Post
        payload = {
            "content": "Testing post creation with #testtag #playure",
            "post_type": "achievement",
            "sport": "Cricket",
            "achievement_type": "Man of the Match",
            "visibility": "public",
            "location": "Delhi, India",
            "is_draft": False,
            "media": [
                {
                    "media_type": "image",
                    "media_url": "https://example.com/test_image.jpg",
                    "sort_order": 0
                }
            ]
        }
        res_create = await ac.post("/api/posts", json=payload, headers=headers)
        assert res_create.status_code == 201
        post_data = res_create.json()
        post_id = post_data["id"]
        assert post_data["content"] == payload["content"]
        assert "testtag" in post_data["hashtags"]

        # Get Post
        res_get = await ac.get(f"/api/posts/{post_id}", headers=headers)
        assert res_get.status_code == 200
        assert res_get.json()["id"] == post_id

        # Update Post
        update_payload = {"content": "Updated test post content #updated"}
        res_update = await ac.put(f"/api/posts/{post_id}", json=update_payload, headers=headers)
        assert res_update.status_code == 200
        assert res_update.json()["content"] == "Updated test post content #updated"

        # Delete Post
        res_del = await ac.delete(f"/api/posts/{post_id}", headers=headers)
        assert res_del.status_code == 200
        assert res_del.json()["success"] is True


@pytest.mark.asyncio
async def test_like_unlike_post():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # First fetch feed to get an existing post ID
        res_feed = await ac.get("/api/feed")
        post_id = res_feed.json()["items"][0]["id"]

        # Like
        res_like = await ac.post(f"/api/posts/{post_id}/like", headers=headers)
        assert res_like.status_code == 200
        assert res_like.json()["is_liked_by_me"] is True

        # Unlike
        res_unlike = await ac.delete(f"/api/posts/{post_id}/like", headers=headers)
        assert res_unlike.status_code == 200
        assert res_unlike.json()["is_liked_by_me"] is False


@pytest.mark.asyncio
async def test_comments_and_nested_replies():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res_feed = await ac.get("/api/feed")
        post_id = res_feed.json()["items"][0]["id"]

        # 1. Add top-level comment
        comment_payload = {"comment": "Great performance!"}
        res_c1 = await ac.post(f"/api/posts/{post_id}/comments", json=comment_payload, headers=headers)
        assert res_c1.status_code == 201
        c1_data = res_c1.json()
        c1_id = c1_data["id"]

        # 2. Add nested reply
        reply_payload = {"comment": "Thank you!", "parent_comment_id": c1_id}
        res_c2 = await ac.post(f"/api/posts/{post_id}/comments", json=reply_payload, headers=headers)
        assert res_c2.status_code == 201
        c2_data = res_c2.json()

        # 3. List comments
        res_list = await ac.get(f"/api/posts/{post_id}/comments")
        assert res_list.status_code == 200
        comments_list = res_list.json()["items"]
        assert len(comments_list) >= 1

        # Delete nested comment
        res_del = await ac.delete(f"/api/comments/{c2_data['id']}", headers=headers)
        assert res_del.status_code == 200


@pytest.mark.asyncio
async def test_search():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/search?q=Virat")
        assert res.status_code == 200
        data = res.json()
        assert len(data["players"]) >= 1


@pytest.mark.asyncio
async def test_trending():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/trending")
        assert res.status_code == 200
        data = res.json()
        assert "trending_hashtags" in data
        assert "trending_sports" in data


@pytest.mark.asyncio
async def test_upcoming_competitions():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/competitions/upcoming")
        assert res.status_code == 200
        data = res.json()
        assert len(data) >= 1
        assert "prize_pool" in data[0]


@pytest.mark.asyncio
async def test_user_suggestions():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/users/suggestions", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_sidebar_summary():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/home/sidebar", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["username"] == "virat_kohli"


@pytest.mark.asyncio
async def test_aggregated_home_endpoint():
    headers = {"X-User-ID": str(DEFAULT_TEST_USER_ID)}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/home", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert "user_summary" in data
        assert "feed" in data
        assert "trending" in data
        assert "upcoming_competitions" in data
        assert "suggested_players" in data
        assert "ai_assistant" in data
