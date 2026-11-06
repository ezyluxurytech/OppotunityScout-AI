# OpportunityScout AI --- Product & Technical Specification

**Project:** OpportunityScout AI\
**Product description:** An AI-powered investment opportunity discovery
and matching platform\
**Tagline:** Connecting Ideas, Businesses, and Talent with Investors.\
**Document purpose:** Implementation guide for building the first
version of the platform.

------------------------------------------------------------------------

## 1. Product Overview

OpportunityScout AI connects people seeking investment or development
support with investors and organizations looking for promising
opportunities.

Opportunity owners create structured profiles for businesses, ideas, or
talents. Investors describe their interests and matching criteria. The
platform uses AI-assisted analysis to summarize and categorize
submissions, identify missing information, and help recommend
potentially relevant matches.

The platform supports discovery, introductions, communication, and
progress tracking. Investment decisions, due diligence, negotiations,
and agreements remain the responsibility of the parties involved.

### 1.1 Product goals

-   Give opportunity owners a consistent way to present businesses,
    ideas, and talents.
-   Help investors discover opportunities beyond their existing
    networks.
-   Reduce the effort required to organize and initially review
    opportunity information.
-   Provide preference-based opportunity recommendations.
-   Support transparent connection requests and progress records.
-   Provide administrators with tools to manage users, submissions,
    reviews, and platform activity.

### 1.2 Success indicators

The first release should make it possible to measure:

-   Number of registered users by role.
-   Number of opportunities submitted and published.
-   Percentage of submissions with completed required information.
-   Number of AI analyses successfully completed.
-   Number of investor preferences saved.
-   Number of matches viewed or saved.
-   Number of connection requests sent, accepted, declined, or
    withdrawn.
-   Time taken from opportunity submission to initial review.

These are product analytics indicators, not promises of investment
performance.

------------------------------------------------------------------------

## 2. User Roles and Permissions

The platform has four primary roles.

  -----------------------------------------------------------------------
  Role                                Main responsibilities
  ----------------------------------- -----------------------------------
  Opportunity Owner                   Creates and manages business, idea,
                                      or talent opportunities; supplies
                                      supporting information; responds to
                                      connection requests; updates
                                      progress.

  Investor                            Creates an investor profile;
                                      defines interests and criteria;
                                      discovers and saves opportunities;
                                      sends connection requests.

  Opportunity Scout                   Identifies and introduces promising
                                      opportunities; submits referrals or
                                      opportunity records where
                                      permitted. Scouts are contributors,
                                      not the primary platform audience.

  Administrator                       Manages accounts, reviews and
                                      moderates submissions, handles
                                      verification workflows, and
                                      monitors platform activity.
  -----------------------------------------------------------------------

### 2.1 Permission principles

-   Users must be authenticated before accessing protected features.
-   A user may only edit their own profile and records unless an
    administrator has the required permission.
-   Opportunity owners may manage their own opportunities.
-   Investors may manage their own investor preferences, saved
    opportunities, and connection requests.
-   Scouts may create or introduce opportunities according to the
    platform's configured scout permissions. A scout must not be able to
    impersonate an opportunity owner.
-   Administrators may review and moderate platform records.
    Administrative actions should be logged.
-   Sensitive contact details and private supporting documents must not
    be exposed to users who do not have permission to view them.
-   Role checks must be enforced by the backend, not only by hiding
    frontend controls.

------------------------------------------------------------------------

## 3. Scope

### 3.1 MVP features

The first release must include:

1.  Account registration, login, logout, and authentication.
2.  Role-based onboarding and profiles.
3.  Opportunity creation, editing, submission, and status tracking.
4.  Investor profiles and investment preferences.
5.  AI-assisted opportunity summaries and categorization.
6.  Missing-information detection and suggested follow-up questions.
7.  Basic preference-based opportunity matching.
8.  Opportunity discovery feed, search, and filters.
9.  Connection requests between investors and opportunity owners.
10. Basic progress tracking.
11. Administrator dashboard and moderation tools.
12. API validation, error handling, logging, and basic audit records.

### 3.2 Out of scope for the first release

-   Executing investments, transfers, escrow, or financial transactions.
-   Betting, prediction markets, or requiring users to stake money.
-   Guaranteeing funding, business success, investment suitability, or
    returns.
-   Automatically verifying all claims made in opportunity submissions.
-   Automated legal, tax, or investment advice.
-   Complex payment processing. Subscription and premium-report
    capabilities may be added in a later phase.
-   Referral-fee workflows until verification, operational controls,
    transparent agreements, and appropriate legal review are in place.

### 3.3 Product boundary

OpportunityScout AI is a discovery and introduction platform. It is not
an investment exchange, broker, bank, or guarantee of funding. Users and
investors remain responsible for their own evaluation, due diligence,
decisions, and agreements, subject to applicable laws and regulations.

------------------------------------------------------------------------

## 4. Functional Requirements

### 4.1 Authentication and account management

-   Users can register with name, email, and password.
-   Users select or are assigned an allowed platform role during
    onboarding.
-   The system validates email uniqueness and password strength.
-   Users can log in and log out.
-   Protected API routes require valid authentication.
-   Users can view and update permitted account details.
-   Administrators can suspend or deactivate accounts.
-   Passwords must be securely hashed; plaintext passwords must never be
    stored or logged.
-   Implement a secure password-reset flow before production launch.

**Acceptance criteria**

-   A registered user can log in with valid credentials.
-   Invalid credentials return a safe, generic error.
-   An unauthenticated user cannot access protected API endpoints.
-   A user cannot change their role by editing a client-side request.

### 4.2 User profiles

**Opportunity owner profile fields**

-   Full name or display name.
-   Email and optional contact information.
-   Location.
-   Short biography.
-   Areas of interest or expertise.
-   Profile image (optional).
-   Organization or business name (optional).

**Investor profile fields**

-   Individual or organization name.
-   Investor type.
-   Short profile/description.
-   Preferred sectors.
-   Preferred opportunity types.
-   Preferred locations.
-   Preferred business stages.
-   Investment interests and criteria.
-   Optional investment range, if supplied by the investor.

**Scout profile fields**

-   Name and contact details.
-   Location.
-   Areas of interest or expertise.
-   Short biography.
-   Referral or introduction history.

**Administrator profile**

-   Name and account details.
-   Administrative permissions.
-   Administrative activity history.

Do not require users to publish private contact information publicly.
Visibility must be controlled.

### 4.3 Opportunity management

Opportunity owners can create, edit, submit, and manage opportunities.

**Opportunity types**

-   Business.
-   Idea.
-   Talent.

**Suggested opportunity fields**

-   Title.
-   Opportunity type.
-   Short summary.
-   Detailed description.
-   Sector/category.
-   Location.
-   Current stage.
-   Problem being addressed.
-   Proposed solution or value proposition.
-   Goals and expected development needs.
-   Investment or support required, if applicable.
-   Use of funds or support (optional).
-   Evidence, milestones, traction, or achievements (optional).
-   Supporting links and documents (optional).
-   Owner.
-   Submission status.
-   Created and updated timestamps.

The form should adapt to the selected opportunity type. For example, a
talent profile may emphasize skills, portfolio links, and development
needs, while a business profile may emphasize products, customers,
traction, and growth goals.

**Opportunity lifecycle**

-   `DRAFT`: created but not submitted.
-   `SUBMITTED`: sent for review.
-   `UNDER_REVIEW`: awaiting or undergoing administrative review.
-   `PUBLISHED`: available for discovery.
-   `NEEDS_INFORMATION`: owner must provide additional information.
-   `REJECTED`: not approved for publication.
-   `ARCHIVED`: no longer active.

Only authorized backend actions may change a status. Record status
changes and the actor responsible.

**Acceptance criteria**

-   An owner can save a draft and return to edit it.
-   Required fields are validated before submission.
-   A submitted opportunity enters the review workflow.
-   An owner cannot publish an opportunity by directly changing a status
    field in the request.
-   Published opportunities appear in permitted discovery results.
-   Owners can see the current status and relevant review feedback.

### 4.4 AI-assisted opportunity analysis

The AI service should:

-   Generate a concise summary from submitted opportunity information.
-   Suggest one or more categories/sectors.
-   Identify missing, unclear, or incomplete information.
-   Suggest follow-up questions for the opportunity owner or reviewer.
-   Return structured output that the main backend can validate and
    store.

AI output is advisory. It must not be presented as independent
verification, a guarantee of business success, or a definitive
investment recommendation.

**AI analysis states**

-   `PENDING`
-   `PROCESSING`
-   `COMPLETED`
-   `FAILED`

Store the input version or opportunity update timestamp used for an
analysis so stale AI results can be identified.

**Acceptance criteria**

-   An authorized backend action can request analysis for an eligible
    opportunity.
-   The AI service returns schema-valid structured data.
-   Failed AI requests can be retried safely.
-   AI output is clearly labeled as AI-generated.
-   Users can distinguish owner-provided information from AI-generated
    summaries and suggestions.
-   AI must not silently overwrite the original opportunity description.

### 4.5 Investor preferences

Investors can create and update matching preferences, including:

-   Preferred sectors.
-   Opportunity types.
-   Preferred locations.
-   Opportunity stages.
-   Other criteria supported by the product.

Preferences should be stored as structured data so they can be used by
the matching service and filters.

### 4.6 Matching and recommendations

The first release should use transparent, explainable, preference-based
matching.

The matching process may compare:

-   Opportunity type.
-   Sector/category.
-   Location.
-   Stage.
-   Investor-selected criteria.
-   Completeness and availability of relevant opportunity information.

Return a match score or relevance level with a short explanation of the
matching criteria. The score is a discovery aid, not a probability of
success or an investment-suitability rating.

**Example response fields**

-   Opportunity identifier.
-   Relevance score or band.
-   Matched criteria.
-   Unmatched or unavailable criteria (where useful).
-   Generated timestamp.

Do not imply that a high match score guarantees funding or investment
returns.

### 4.7 Discovery feed and search

Investors and other permitted users can browse published opportunities.

Support filters for:

-   Opportunity type.
-   Sector/category.
-   Location.
-   Stage.
-   Other available structured attributes.

Support keyword search across appropriate public opportunity fields.
Apply pagination and stable sorting. Do not return private owner
information or private documents in public search responses.

### 4.8 Saved opportunities

Investors should be able to save or unsave opportunities for later
review. Saved records are private to the investor.

### 4.9 Connection requests

Investors can express interest and request a connection with an
opportunity owner.

**Connection request states**

-   `PENDING`
-   `ACCEPTED`
-   `DECLINED`
-   `WITHDRAWN`
-   `CLOSED`

A request should contain the sender, recipient/owner, opportunity,
optional introductory message, status, and timestamps.

-   Investors can view and withdraw their own pending requests.
-   Opportunity owners can review requests related to their
    opportunities and accept or decline them.
-   Only authorized participants and administrators can view request
    details.
-   Do not expose private contact details before the applicable consent
    or connection workflow permits it.

### 4.10 Progress tracking

Record user-reported progress stages such as:

-   Submitted.
-   Under review.
-   Interest received.
-   Discussion.
-   Outcome.

Progress records should include the opportunity or connection they
relate to, the stage, optional note, actor, and timestamp. Make clear
that updates are user-provided and are not independently verified unless
a separate verification process is implemented.

### 4.11 Administration and moderation

The admin dashboard should allow authorized administrators to:

-   View and manage user accounts.
-   Review submitted opportunities.
-   Request additional information.
-   Approve/publish or reject submissions.
-   Moderate inappropriate or misleading content.
-   View connection and progress activity at an appropriate
    administrative level.
-   Review AI analysis results.
-   View basic platform activity metrics.
-   Inspect administrative audit records.

Administrative endpoints must enforce role permissions and record
important actions.

------------------------------------------------------------------------

## 5. Technical Stack and Architecture

Use the following stack as required:

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + TypeScript    Web application, pages,
                                                  forms, dashboards,
                                                  discovery experience.

  Main backend            NestJS                  REST API,
                                                  authentication,
                                                  authorization, business
                                                  logic, validation,
                                                  orchestration.

  Database                PostgreSQL              Persistent relational
                                                  data.

  ORM                     Prisma                  Database schema,
                                                  migrations, and typed
                                                  database access from
                                                  NestJS.

  AI service              Python + FastAPI        AI analysis, structured
                                                  summaries,
                                                  categorization,
                                                  missing-information
                                                  detection, and matching
                                                  assistance.
  -----------------------------------------------------------------------

### 5.1 Recommended system design

Use a modular monorepo so the frontend, main API, and AI service can be
developed and deployed independently while sharing one repository.

``` text
opportunityscout-ai/
├── apps/
│   └── web/                     # Next.js + TypeScript
├── services/
│   ├── api/                     # NestJS application
│   └── ai/                      # Python + FastAPI service
├── packages/
│   └── contracts/               # Shared API types/schemas where practical
├── docs/
│   ├── architecture.md
│   └── api.md
├── infra/
│   └── docker/                  # Local development container configuration
├── .env.example
├── .gitignore
├── README.md
└── spec.md
```

This is a recommended repository layout, not a constraint imposed by the
product brief.

### 5.2 Service responsibilities

**Next.js web application**

-   Render public pages and authenticated dashboards.
-   Provide role-specific onboarding and navigation.
-   Provide opportunity and investor profile forms.
-   Display discovery results, filters, and match explanations.
-   Display AI summaries with clear AI-generated labels.
-   Provide connection-request and progress interfaces.
-   Call the NestJS API; do not connect directly to PostgreSQL.

**NestJS API**

-   Be the primary entry point for frontend requests.
-   Own authentication, authorization, validation, and business rules.
-   Own all normal application database access through Prisma.
-   Manage users, profiles, opportunities, preferences, matches, saved
    items, connection requests, progress records, and admin workflows.
-   Call the FastAPI service for AI tasks.
-   Validate and persist AI service responses.
-   Apply rate limits and permission checks to sensitive endpoints.

**FastAPI AI service**

-   Expose internal endpoints for opportunity analysis and matching
    assistance.
-   Validate request and response payloads with Pydantic.
-   Return structured JSON, not unvalidated free-form text alone.
-   Keep AI provider/model integration behind a service interface so it
    can be changed later.
-   Avoid direct ownership of application data.
-   Do not expose the AI service publicly unless required and protected.
-   Treat all user-submitted content as untrusted input.

**PostgreSQL + Prisma**

-   PostgreSQL is the source of truth for application records.
-   Prisma schema and migrations are maintained by the NestJS
    application.
-   FastAPI should not independently modify the same application tables
    in the MVP. NestJS should send only the necessary data to the AI
    service and persist validated results.

### 5.3 Request flow

``` text
Browser
  |
  v
Next.js frontend
  |
  | HTTPS / JSON
  v
NestJS REST API
  |                 \
  | Prisma           \ Internal HTTP request
  v                    v
PostgreSQL          FastAPI AI service
                         |
                         v
                  AI model/provider
```

The NestJS API remains responsible for permissions and persistence. The
AI service returns analysis; NestJS validates and stores it.

------------------------------------------------------------------------

## 6. Suggested Backend Modules

Organize NestJS by business domain.

``` text
services/api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   ├── pipes/
│   └── dto/
├── config/
├── prisma/
├── auth/
├── users/
├── profiles/
├── opportunities/
├── opportunity-analysis/
├── investor-preferences/
├── matching/
├── discovery/
├── saved-opportunities/
├── connection-requests/
├── progress/
├── admin/
└── health/
```

Each module should contain its controller, service, DTOs, and module
definition as appropriate.

### 6.1 Suggested API routes

Prefix routes with `/api/v1`.

  -----------------------------------------------------------------------------------
  Method                  Route                               Purpose
  ----------------------- ----------------------------------- -----------------------
  POST                    `/auth/register`                    Register account

  POST                    `/auth/login`                       Authenticate

  POST                    `/auth/refresh`                     Refresh session/token,
                                                              if refresh-token flow
                                                              is used

  POST                    `/auth/logout`                      End session

  GET                     `/users/me`                         Get current user

  PATCH                   `/users/me`                         Update current user

  GET                     `/profiles/me`                      Get current user's role
                                                              profile

  PUT                     `/profiles/me`                      Create or update role
                                                              profile

  POST                    `/opportunities`                    Create opportunity
                                                              draft

  GET                     `/opportunities/:id`                Get permitted
                                                              opportunity details

  PATCH                   `/opportunities/:id`                Update owned draft or
                                                              permitted record

  POST                    `/opportunities/:id/submit`         Submit opportunity for
                                                              review

  GET                     `/opportunities/me`                 List current user's
                                                              opportunities

  GET                     `/opportunities`                    Discover published
                                                              opportunities

  POST                    `/opportunities/:id/analyze`        Request AI analysis

  GET                     `/opportunities/:id/analysis`       Get latest permitted AI
                                                              analysis

  GET                     `/investor/preferences/me`          Get investor
                                                              preferences

  PUT                     `/investor/preferences/me`          Create/update
                                                              preferences

  GET                     `/matches`                          Get current investor's
                                                              recommendations

  POST                    `/opportunities/:id/save`           Save opportunity

  DELETE                  `/opportunities/:id/save`           Remove saved
                                                              opportunity

  GET                     `/saved-opportunities`              List saved
                                                              opportunities

  POST                    `/connection-requests`              Send connection request

  GET                     `/connection-requests`              List requests visible
                                                              to current user

  PATCH                   `/connection-requests/:id`          Accept, decline,
                                                              withdraw, or close as
                                                              permitted

  POST                    `/progress`                         Add progress update

  GET                     `/opportunities/:id/progress`       View permitted progress
                                                              history

  GET                     `/admin/opportunities`              Admin review queue

  PATCH                   `/admin/opportunities/:id/review`   Admin review action

  GET                     `/admin/users`                      Admin user management

  GET                     `/admin/metrics`                    Basic admin metrics

  GET                     `/health`                           API health check
  -----------------------------------------------------------------------------------

The exact request and response DTOs should be documented as the
endpoints are implemented. Use consistent pagination, validation, and
error response formats.

------------------------------------------------------------------------

## 7. Suggested Database Model

The following is a logical starting point for the Prisma schema. Exact
field types and relations should be refined during implementation.

### 7.1 Core entities

**User** - `id` - `name` - `email` (unique) - `passwordHash` - `role` -
`status` - `createdAt` - `updatedAt`

**OpportunityOwnerProfile** - `id` - `userId` (unique relation) -
`displayName` - `location` - `bio` - `contactVisibility`

**InvestorProfile** - `id` - `userId` (unique relation) -
`organizationName` (optional) - `investorType` - `description` -
`location`

**ScoutProfile** - `id` - `userId` (unique relation) - `bio` -
`location` - `expertise`

**Opportunity** - `id` - `ownerId` - `scoutId` (optional) - `title` -
`type` - `summary` - `description` - `sector` - `location` - `stage` -
`problem` - `solution` - `goals` - `supportRequired` (optional) -
`useOfFunds` (optional) - `evidence` (optional structured data) -
`status` - `createdAt` - `updatedAt` - `submittedAt` - `publishedAt`

**InvestorPreference** - `id` - `investorId` - `sectors` -
`opportunityTypes` - `locations` - `stages` - `criteria` (structured
JSON where appropriate) - `createdAt` - `updatedAt`

**OpportunityAnalysis** - `id` - `opportunityId` - `inputVersion` or
source update timestamp - `summary` - `categories` -
`missingInformation` - `suggestedQuestions` - `status` -
`modelIdentifier` (optional) - `createdAt` - `updatedAt`

**OpportunityMatch** - `id` - `investorId` - `opportunityId` - `score`
or `relevanceBand` - `matchedCriteria` - `explanation` - `generatedAt`

**SavedOpportunity** - `id` - `investorId` - `opportunityId` -
`createdAt`

**ConnectionRequest** - `id` - `investorId` - `opportunityId` -
`ownerId` - `message` - `status` - `createdAt` - `updatedAt`

**ProgressUpdate** - `id` - `opportunityId` - `connectionRequestId`
(optional) - `actorId` - `stage` - `note` - `createdAt`

**AuditLog** - `id` - `actorId` - `action` - `entityType` - `entityId` -
`metadata` - `createdAt`

### 7.2 Database constraints and indexes

-   Unique index on `User.email`.
-   Unique constraints for one role profile per user where applicable.
-   Unique composite constraint on `(investorId, opportunityId)` for
    saved opportunities.
-   Index opportunity records by status, type, sector, location, stage,
    and creation date as query patterns require.
-   Index connection requests by investor, owner, opportunity, and
    status.
-   Add foreign keys and appropriate deletion behavior.
-   Use transactions for multi-record operations that must succeed or
    fail together.
-   Use database migrations; do not modify production schemas manually.

Use enums for roles and stable lifecycle states. Use JSON fields only
for genuinely flexible structured data; keep frequently filtered fields
relational or otherwise queryable.

------------------------------------------------------------------------

## 8. FastAPI Service Contract

Suggested internal endpoints:

  -------------------------------------------------------------------------------------
  Method                  Endpoint                              Purpose
  ----------------------- ------------------------------------- -----------------------
  GET                     `/health`                             Health check

  POST                    `/internal/v1/opportunity-analysis`   Generate summary,
                                                                categories, missing
                                                                details, and questions

  POST                    `/internal/v1/match-assistance`       Return matching
                                                                assistance for supplied
                                                                investor preferences
                                                                and opportunity data
  -------------------------------------------------------------------------------------

### 8.1 Example analysis request

``` json
{
  "opportunity_id": "opportunity-id",
  "title": "Example opportunity",
  "type": "BUSINESS",
  "description": "Owner-provided opportunity description",
  "sector": "Agriculture",
  "location": "Lagos, Nigeria",
  "stage": "EARLY_STAGE"
}
```

### 8.2 Example analysis response

``` json
{
  "summary": "A concise summary based only on the submitted information.",
  "categories": ["Agriculture", "Technology"],
  "missing_information": [
    "Customer validation details were not supplied."
  ],
  "suggested_questions": [
    "Who are the intended customers?",
    "What evidence of demand is currently available?"
  ],
  "disclaimer": "AI-generated assistance. Information has not been independently verified."
}
```

These examples illustrate the proposed contract; they are not claims
about a selected AI provider or model.

### 8.3 AI service safeguards

-   Validate all incoming payloads.
-   Enforce request-size and timeout limits.
-   Use structured output schemas.
-   Handle provider failures and malformed responses.
-   Do not treat AI-generated content as verified fact.
-   Do not let model output execute code, SQL, or privileged actions.
-   Keep provider credentials in environment variables or a secrets
    manager.
-   Avoid logging full sensitive submissions or credentials.
-   Clearly distinguish generated content from user-supplied content.

------------------------------------------------------------------------

## 9. Frontend Pages and User Experience

### 9.1 Public pages

-   Landing page: explain the platform and its purpose.
-   How it works: explain the opportunity-owner and investor journeys.
-   Opportunity discovery preview: show only information approved for
    public display.
-   Sign up and login.
-   Terms, privacy, and platform-boundary information.

### 9.2 Opportunity owner dashboard

-   Overview of submitted opportunities and their statuses.
-   Create opportunity flow.
-   Edit drafts and records requiring more information.
-   View AI-generated summary and suggestions.
-   View connection requests.
-   Add progress updates.

### 9.3 Investor dashboard

-   Investor profile and preference settings.
-   Recommended opportunities.
-   Discovery feed and filters.
-   Opportunity detail view.
-   Saved opportunities.
-   Sent connection requests and their statuses.

### 9.4 Scout dashboard

-   Submit or introduce an opportunity.
-   View permitted referral records and statuses.
-   See relevant feedback where authorized.

### 9.5 Admin dashboard

-   Platform overview.
-   User management.
-   Opportunity review queue.
-   Opportunity detail and moderation actions.
-   AI analysis review.
-   Audit/activity records.

### 9.6 UX requirements

-   Responsive layouts for desktop, tablet, and mobile.
-   Accessible labels, keyboard navigation, and clear validation
    messages.
-   Loading, empty, success, and error states for all major workflows.
-   Confirmation for destructive or consequential actions.
-   Clear status labels and timestamps.
-   AI-generated information must be visually distinguishable from
    owner-provided information.
-   Do not use match scores or AI language that implies guaranteed
    outcomes.

------------------------------------------------------------------------

## 10. Security, Privacy, and Reliability

-   Hash passwords using a current, secure password-hashing algorithm.
-   Use HTTPS in deployed environments.
-   Store secrets outside source control.
-   Validate and sanitize incoming data.
-   Apply role-based authorization on every protected backend operation.
-   Apply rate limiting to authentication, AI, and connection-request
    endpoints.
-   Configure CORS for trusted frontend origins only.
-   Use secure session or token handling; avoid exposing long-lived
    credentials to browser scripts.
-   Restrict uploaded file types, sizes, and access. Store files in
    private object storage if file uploads are implemented.
-   Protect private contact details and supporting documents.
-   Maintain audit logs for important administrative and moderation
    actions.
-   Back up PostgreSQL and test restoration procedures.
-   Use generic authentication errors that do not reveal whether an
    account exists.
-   Establish retention and deletion policies for user data.
-   Do not represent AI analysis as verification or financial advice.

------------------------------------------------------------------------

## 11. Configuration and Environment Variables

Create `.env.example` files with placeholder values only. Never commit
real credentials.

**NestJS API example**

``` env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/opportunityscout
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
WEB_ORIGIN=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=replace_me
```

**Next.js example**

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

Only expose variables prefixed with `NEXT_PUBLIC_` when they are safe
for browser access.

**FastAPI example**

``` env
APP_ENV=development
PORT=8000
AI_PROVIDER_API_KEY=replace_me
INTERNAL_API_KEY=replace_me
```

Use the actual selected AI provider's configuration when that provider
is chosen. Do not hard-code credentials.

------------------------------------------------------------------------

## 12. Development and Deployment

### 12.1 Local development

Recommended local services:

-   Next.js web app on port `3000`.
-   NestJS API on port `4000`.
-   FastAPI service on port `8000`.
-   PostgreSQL on port `5432`.

Use Docker Compose for PostgreSQL and optionally for all services.
Provide setup instructions for installing dependencies, configuring
environment variables, running migrations, and starting each service.

### 12.2 Database workflow

-   Define the schema in the NestJS Prisma project.
-   Generate Prisma Client after schema changes.
-   Create and apply migrations in development.
-   Use migration deployment commands in staging/production.
-   Seed only safe development data.
-   Never use production user data as local seed data.

### 12.3 Deployment shape

Deploy the web app, NestJS API, FastAPI service, and PostgreSQL as
separately configurable services. Keep the AI service on a private
network where possible. Use managed PostgreSQL and secure secrets
management in production.

Add health checks, structured logs, error monitoring, and backup
monitoring before production use.

------------------------------------------------------------------------

## 13. Testing Requirements

**Frontend** - Component tests for key forms and status displays. -
End-to-end tests for registration, onboarding, opportunity submission,
discovery, and connection requests.

**NestJS** - Unit tests for services and permission logic. - Integration
tests for database-backed workflows. - E2E tests for authentication,
opportunity lifecycle, matching, and admin review.

**FastAPI** - Unit tests for request validation and response schemas. -
Tests for provider errors, timeouts, malformed outputs, and retry
behavior. - Tests confirming that AI output is treated as advisory data.

**Cross-service** - Contract tests for NestJS-to-FastAPI payloads. -
Tests for unavailable AI service behavior. - Tests for duplicate
connection requests and duplicate saved opportunities. - Tests
confirming users cannot access another user's private records.

------------------------------------------------------------------------

## 14. Suggested Implementation Phases

### Phase 1 --- Foundation

-   Create monorepo structure.
-   Configure Next.js, NestJS, FastAPI, PostgreSQL, and Prisma.
-   Configure environment variables and local development.
-   Add health endpoints and basic logging.
-   Create initial database schema and migrations.

### Phase 2 --- Accounts and profiles

-   Implement registration and authentication.
-   Implement roles and backend authorization.
-   Build role-specific onboarding and profile pages.

### Phase 3 --- Opportunity workflow

-   Implement opportunity creation, editing, submission, review, and
    publication.
-   Build opportunity owner dashboard.
-   Build administrator review queue.

### Phase 4 --- Investor discovery

-   Implement investor preferences.
-   Build discovery feed, search, filters, and saved opportunities.
-   Implement explainable preference-based matching.

### Phase 5 --- AI integration

-   Implement FastAPI analysis endpoints.
-   Connect NestJS to FastAPI.
-   Store and display summaries, categories, missing information, and
    suggested questions.
-   Add failure handling and clear AI disclaimers.

### Phase 6 --- Connections and progress

-   Implement connection requests and their lifecycle.
-   Implement progress updates and history.
-   Add participant notifications if included in the release plan.

### Phase 7 --- Hardening and launch

-   Complete authorization and privacy tests.
-   Add rate limits, backups, monitoring, and production configuration.
-   Review terms, privacy notices, and applicable legal requirements.
-   Conduct user acceptance testing.

------------------------------------------------------------------------

## 15. MVP Definition of Done

The MVP is ready for an initial release when:

-   All four roles can access only the features permitted to them.
-   Users can register, authenticate, and manage their role profiles.
-   Opportunity owners can create, submit, and track opportunities.
-   Administrators can review, request information, publish, or reject
    submissions.
-   Investors can save preferences and discover published opportunities.
-   Matching results are based on stored preferences and explain the
    criteria used.
-   AI can return a structured summary, categories, missing information,
    and suggested questions.
-   AI output is clearly labeled and never presented as verified fact or
    guaranteed investment advice.
-   Investors can send connection requests and owners can respond.
-   Permitted users can view progress records.
-   Private data is protected by backend authorization.
-   Core workflows have automated tests.
-   Setup, environment, migration, and deployment instructions are
    documented.

------------------------------------------------------------------------

## 16. Decisions to Confirm During Implementation

The project brief does not specify the following technical or
operational choices. Confirm them before implementing the related
production features:

1.  AI provider and model.
2.  Whether authentication will use secure cookie-based sessions or
    access/refresh tokens.
3.  Email delivery provider for verification and password reset.
4.  File storage provider and allowed document/image types.
5.  Whether opportunity publication requires administrator approval in
    every case.
6.  Exact investment-range fields and visibility rules.
7.  Whether notifications are in-app only or also sent by email.
8.  Subscription/payment provider and pricing, if monetization is
    introduced.
9.  Jurisdiction-specific legal, privacy, and regulatory requirements.
10. Production hosting and monitoring providers.

Do not invent these decisions as settled product requirements.

------------------------------------------------------------------------

## 17. Core Product Principles

1.  **Discovery, not execution:** The platform introduces parties; it
    does not execute investments.
2.  **Human responsibility:** Users and investors make their own
    decisions and agreements.
3.  **AI as assistance:** AI organizes and summarizes information but
    does not verify claims or guarantee outcomes.
4.  **Permission by role:** Users access only the data and actions
    authorized for their role.
5.  **Transparency:** Show opportunity status, connection status, and
    the basis of match recommendations clearly.
6.  **Privacy:** Protect private contact information and supporting
    materials.
7.  **Incremental delivery:** Build and test the MVP workflow before
    introducing subscriptions, premium reports, or referral-fee
    services.




    SUPABASE:
    SUPABASE_URL=https://marcpsbxtxpfzmtizsso.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xl1oErq6YQ-Hq7Ny25Rb9g_ECMvZBZ3
SUPABASE_SECRET_KEY=replace_me
SUPABASE_JWKS_URL=https://marcpsbxtxpfzmtizsso.supabase.co/auth/v1/.well-known/jwks.json


------------------------------------------------------------------------

**End of specification.**
