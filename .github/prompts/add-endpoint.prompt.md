---
sem: 1
description: Generate FastAPI endpoints with Pydantic models, error handling, and OpenAPI docs
application: "When generating documentation, READMEs, or technical writing"
agent: Backend
---

# /add-endpoint - FastAPI Endpoint Generation

Generate production-ready FastAPI endpoints with Pydantic validation, proper error handling, and OpenAPI documentation.

## Endpoint Template

```python
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

router = APIRouter(prefix="/items", tags=["items"])

# Request/Response Models
class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Item name")
    description: Optional[str] = Field(None, max_length=500)

    class Config:
        json_schema_extra = {
            "example": {"name": "Widget", "description": "A useful widget"}
        }

class ItemResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime

class ItemList(BaseModel):
    items: list[ItemResponse]
    total: int
    page: int
    page_size: int

# Endpoints
@router.post(
    "/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new item",
    responses={409: {"description": "Item already exists"}},
)
async def create_item(
    item: ItemCreate,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ItemResponse:
    """Create a new item with the provided details."""
    existing = await db.items.find_one({"name": item.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Item '{item.name}' already exists",
        )
    result = await db.items.insert_one(item.model_dump())
    return ItemResponse(id=result.inserted_id, **item.model_dump())

@router.get(
    "/{item_id}",
    response_model=ItemResponse,
    responses={404: {"description": "Item not found"}},
)
async def get_item(item_id: UUID, db: Database = Depends(get_db)) -> ItemResponse:
    """Retrieve an item by its ID."""
    item = await db.items.find_one({"_id": item_id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found",
        )
    return ItemResponse(**item)
```

## HTTP Method Selection

| Operation | Method | Status Code | Idempotent |
| --------- | ------ | ----------- | ---------- |
| Create | POST | 201 Created | No |
| Read | GET | 200 OK | Yes |
| Update (full) | PUT | 200 OK | Yes |
| Update (partial) | PATCH | 200 OK | No |
| Delete | DELETE | 204 No Content | Yes |
| Exists check | HEAD | 200/404 | Yes |

## Error Response Pattern

```python
from fastapi import HTTPException, status

# Standard errors
raise HTTPException(status_code=404, detail="Resource not found")
raise HTTPException(status_code=400, detail="Invalid input")
raise HTTPException(status_code=401, detail="Not authenticated")
raise HTTPException(status_code=403, detail="Not authorized")
raise HTTPException(status_code=409, detail="Conflict with existing resource")
```

## Input Required

Provide:

1. **Resource name** — What entity does this manage?
2. **Operations** — CRUD subset (create, read, update, delete, list)
3. **Fields** — What data does the resource have?
4. **Auth required?** — Public, authenticated, or role-based?
5. **Database** — Cosmos DB, PostgreSQL, in-memory?

I'll generate complete endpoints with models, validation, and error handling.
