---
name: api-design
description: API design patterns and best practices. Use when user asks about API design, REST endpoints, or API documentation.
---

# API Design

RESTful API design patterns.

## Resource Naming

```
GET    /users              # List users
GET    /users/{id}         # Get single user
POST   /users              # Create user
PUT    /users/{id}         # Replace user
PATCH  /users/{id}         # Update user
DELETE /users/{id}         # Delete user
```

## Query Parameters

```
GET /users?page=1&pageSize=20    # Pagination
GET /users?sort=name&order=asc   # Sorting
GET /users?filter=active         # Filtering
GET /users?fields=id,name        # Field selection
```

## Response Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "issue": "required" }
    ]
  }
}
```

## Versioning

Prefer URL versioning:
```
/api/v1/users
/api/v2/users
```

## Documentation

Use OpenAPI/Swagger for all APIs. Include:
- Endpoint descriptions
- Request/response schemas
- Example payloads
- Error responses
