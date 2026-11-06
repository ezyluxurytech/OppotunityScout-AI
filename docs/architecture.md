# OpportunityScout AI — Architecture

## Overview

Three-tier architecture with a React frontend, NestJS API gateway, and a Python AI service.

```
Browser
  |
  v
Next.js (port 3000)
  |
  | HTTPS / JSON (JWT Bearer token)
  v
NestJS REST API (port 4000)
  |                   \
  | Prisma             \ Internal HTTP (X-API-Key)
  v                     v
PostgreSQL (5432)    FastAPI AI Service (port 8000)
                          |
                          v
                    AI Provider (OpenAI / configurable)
```

## Service Responsibilities

### Next.js Web App
- Renders public pages and role-specific dashboards
- Handles authentication state (JWT in cookies)
- Calls NestJS API — never directly queries PostgreSQL
- Displays AI summaries with clear AI-generated labels

### NestJS REST API
- Single entry point for all frontend requests
- Owns authentication (JWT access + refresh tokens)
- Enforces role-based authorization on every route
- Owns all database access via Prisma
- Orchestrates AI analysis requests to FastAPI
- Validates and persists AI responses

### FastAPI AI Service
- Internal service — not publicly exposed
- Validates requests with Pydantic
- Abstracts the AI provider behind a service interface
- Returns structured JSON only
- Has a rule-based fallback for development without API keys

### PostgreSQL + Prisma
- Source of truth for all application data
- Schema and migrations owned by NestJS
- FastAPI does not write to application tables directly

## Authentication Flow

1. User logs in → NestJS returns `accessToken` (15m) + `refreshToken` (7d)
2. Frontend stores tokens in secure HTTP cookies
3. All API requests include `Authorization: Bearer <accessToken>`
4. On 401, frontend auto-refreshes using the refresh token
5. Logout deletes all refresh tokens from the database

## Role-Based Access Control

Roles are enforced server-side via `RolesGuard`. The frontend hides
controls based on role, but the backend always re-checks.

| Role | Key capabilities |
|------|-----------------|
| OPPORTUNITY_OWNER | Create/edit/submit opportunities; view connections |
| INVESTOR | Set preferences; discover; save; send connections |
| SCOUT | Create/submit opportunities on behalf of owners |
| ADMIN | Review, publish, reject; manage users; view audit logs |

## Opportunity Lifecycle

```
DRAFT → SUBMITTED → UNDER_REVIEW → PUBLISHED
                              ↓
                    NEEDS_INFORMATION → SUBMITTED (re-submit)
                              ↓
                           REJECTED
                           ARCHIVED
```

## AI Analysis Flow

1. Owner or admin requests analysis via `POST /opportunities/:id/analyze`
2. NestJS creates an `OpportunityAnalysis` record in `PENDING` state
3. NestJS fires an async HTTP request to FastAPI
4. FastAPI calls the AI provider and returns structured JSON
5. NestJS validates the response and updates the record to `COMPLETED`
6. On failure, status is set to `FAILED` (retryable)

AI output is labeled and never overwrites the original opportunity description.
