# OpportunityScout AI

**Connecting Ideas, Businesses, and Talent with Investors.**

An AI-powered investment opportunity discovery and matching platform.

---

## Repository Structure

```
opportunityscout-ai/
├── apps/
│   └── web/                     # Next.js + TypeScript frontend
├── services/
│   ├── api/                     # NestJS REST API
│   └── ai/                      # Python + FastAPI AI service
├── packages/
│   └── contracts/               # Shared types/schemas
├── docs/
│   ├── architecture.md
│   └── api.md
├── infra/
│   └── docker/                  # Docker Compose configs
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional but recommended)

### 1. Clone and install

```bash
# Install root workspace deps
npm install

# Install Next.js deps
cd apps/web && npm install

# Install NestJS deps
cd services/api && npm install

# Install Python deps
cd services/ai && pip install -r requirements.txt
```

### 2. Configure environment

```bash
# Copy env examples and fill in values
cp .env.example .env
cp services/api/.env.example services/api/.env
cp apps/web/.env.example apps/web/.env.local
cp services/ai/.env.example services/ai/.env
```

### 3. Start PostgreSQL (via Docker)

```bash
docker-compose -f infra/docker/docker-compose.yml up -d postgres
```

### 4. Run database migrations

```bash
cd services/api
npx prisma migrate dev
```

### 5. Start all services

```bash
# Terminal 1 - Next.js (port 3000)
cd apps/web && npm run dev

# Terminal 2 - NestJS API (port 4000)
cd services/api && npm run start:dev

# Terminal 3 - FastAPI AI service (port 8000)
cd services/ai && uvicorn main:app --reload --port 8000
```

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Next.js frontend |
| API | http://localhost:4000/api/v1 | NestJS REST API |
| AI Service | http://localhost:8000 | FastAPI AI service |
| API Docs | http://localhost:4000/api/docs | Swagger UI |
| AI Docs | http://localhost:8000/docs | FastAPI auto-docs |

## Roles

- **Opportunity Owner** - Creates and manages opportunities
- **Investor** - Discovers opportunities and sends connection requests
- **Scout** - Introduces opportunities
- **Administrator** - Manages platform, reviews submissions

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **API**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **AI Service**: Python, FastAPI, OpenAI (configurable)
- **Auth**: JWT (access + refresh tokens)
