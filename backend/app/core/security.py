import uuid
from typing import Optional
from fastapi import Header
from app.core.config import settings

# Default system test user UUID when running without explicit auth tokens
DEFAULT_TEST_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


async def get_current_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
) -> uuid.UUID:
    """
    Extract current user ID from JWT authorization header or X-User-ID custom header.
    Defaults to system test user if no credentials provided (for dev/swagger testing).
    """
    if x_user_id:
        try:
            return uuid.UUID(x_user_id)
        except ValueError:
            # Deterministic UUID generation from Clerk ID or other custom string
            return uuid.uuid5(uuid.NAMESPACE_DNS, x_user_id)

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # JWT readiness: in a full auth setup, decode JWT token here.
        # If token is a valid UUID string, use it directly
        try:
            return uuid.UUID(token)
        except ValueError:
            pass

    return DEFAULT_TEST_USER_ID


async def get_optional_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
) -> Optional[uuid.UUID]:

    if x_user_id:
        try:
            return uuid.UUID(x_user_id)
        except ValueError:
            # Deterministic UUID generation from Clerk ID or other custom string
            return uuid.uuid5(uuid.NAMESPACE_DNS, x_user_id)

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            return uuid.UUID(token)
        except ValueError:
            pass

    return DEFAULT_TEST_USER_ID

