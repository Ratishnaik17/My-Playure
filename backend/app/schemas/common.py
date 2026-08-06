from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    has_next: bool
    has_previous: bool


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    meta: PaginationMeta


class StatusResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)
