# OpportunityScout AI — API Reference

Base URL: `http://localhost:4000/api/v1`

Interactive docs: `http://localhost:4000/api/docs` (Swagger UI)

---

## Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register a new account |
| POST | `/auth/login` | Login and get tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (requires Bearer token) |

All protected routes require: `Authorization: Bearer <accessToken>`

---

## Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users/me` | Get current user |
| PATCH | `/users/me` | Update current user |

---

## Profiles

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/profiles/me` | Get current user's role profile |
| PUT | `/profiles/me/owner` | Create/update owner profile |
| PUT | `/profiles/me/investor` | Create/update investor profile |

---

## Opportunities

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/opportunities` | Public | Discover published opportunities |
| POST | `/opportunities` | Owner/Scout | Create draft |
| GET | `/opportunities/me` | Owner/Scout | List my opportunities |
| GET | `/opportunities/:id` | Auth | Get opportunity details |
| PATCH | `/opportunities/:id` | Owner/Scout/Admin | Update opportunity |
| POST | `/opportunities/:id/submit` | Owner/Scout | Submit for review |
| POST | `/opportunities/:id/analyze` | Owner/Admin | Request AI analysis |
| GET | `/opportunities/:id/analysis` | Auth | Get AI analysis |
| GET | `/opportunities/:id/progress` | Auth | Get progress history |

---

## Investor

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/investor/preferences/me` | Get investor preferences |
| PUT | `/investor/preferences/me` | Save investor preferences |
| GET | `/matches` | Get preference-based recommendations |
| GET | `/saved-opportunities` | List saved opportunities |
| POST | `/opportunities/:id/save` | Save an opportunity |
| DELETE | `/opportunities/:id/save` | Unsave an opportunity |

---

## Connection Requests

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/connection-requests` | Send a connection request |
| GET | `/connection-requests` | List requests (role-dependent view) |
| PATCH | `/connection-requests/:id` | Accept/decline/withdraw/close |

---

## Progress

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/progress` | Add a progress update |

---

## Admin

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin/opportunities` | Review queue |
| PATCH | `/admin/opportunities/:id/review` | Review action |
| GET | `/admin/users` | List/search users |
| PATCH | `/admin/users/:id` | Suspend/activate user |
| GET | `/admin/metrics` | Platform metrics |
| GET | `/admin/audit-logs` | Audit logs |

---

## Health

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | API health check |

---

## Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/opportunities"
}
```

## Pagination

Paginated endpoints accept `?page=1&limit=20` and return:

```json
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```
