"""
OpportunityScout AI Service
FastAPI service for AI-assisted opportunity analysis and matching.

IMPORTANT: This service is for internal use only.
Do not expose it publicly without authentication and rate limiting.
"""
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from config import settings
from schemas import (
    OpportunityAnalysisRequest,
    OpportunityAnalysisResponse,
    MatchAssistanceRequest,
    MatchAssistanceResponse,
    HealthResponse,
)
from ai_provider import analyze_opportunity

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("opportunityscout.ai")

# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="OpportunityScout AI Service",
    description=(
        "Internal AI service for opportunity analysis and matching assistance. "
        "Not for direct public access."
    ),
    version="1.0.0",
    docs_url="/docs" if settings.APP_ENV == "development" else None,
    redoc_url="/redoc" if settings.APP_ENV == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],  # Only allow NestJS API
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ─── Auth dependency ─────────────────────────────────────────────────────────
def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify the internal API key. Skip check if no key is configured (dev mode)."""
    if settings.INTERNAL_API_KEY and settings.INTERNAL_API_KEY != "replace_me":
        if x_api_key != settings.INTERNAL_API_KEY:
            raise HTTPException(status_code=401, detail="Invalid or missing API key.")
    return x_api_key


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat(),
    )


@app.post(
    "/internal/v1/opportunity-analysis",
    response_model=OpportunityAnalysisResponse,
    tags=["analysis"],
    summary="Generate AI analysis for an opportunity",
)
async def opportunity_analysis(
    request: OpportunityAnalysisRequest,
    _: str = Depends(verify_api_key),
):
    """
    Analyze an opportunity submission and return:
    - A concise summary
    - Suggested categories
    - Missing information
    - Follow-up questions

    AI output is advisory only. It does not verify claims or constitute investment advice.
    """
    logger.info(f"Analysis requested for opportunity: {request.opportunity_id}")

    try:
        result = analyze_opportunity(request.model_dump())
        return OpportunityAnalysisResponse(**result)
    except RuntimeError as e:
        logger.error(f"Analysis failed for {request.opportunity_id}: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {e}")
        raise HTTPException(status_code=500, detail="Analysis service error. Please retry.")


@app.post(
    "/internal/v1/match-assistance",
    response_model=MatchAssistanceResponse,
    tags=["matching"],
    summary="Return match assistance for investor preferences vs opportunity",
)
async def match_assistance(
    request: MatchAssistanceRequest,
    _: str = Depends(verify_api_key),
):
    """
    Compute a preference-based match score between an investor's preferences
    and an opportunity. Returns a score, relevance band, and explanation.

    Score is a discovery aid. It does not indicate investment suitability or
    guarantee any outcome.
    """
    prefs = request.investor_preferences
    opp = request.opportunity

    criteria_checked = []
    score = 0
    total_weight = 0

    # Sector
    if prefs.get("sectors") and opp.get("sector"):
        weight = 30
        total_weight += weight
        if any(s.lower() in opp["sector"].lower() for s in prefs["sectors"]):
            score += weight
            criteria_checked.append("Sector")

    # Type
    if prefs.get("opportunityTypes") and opp.get("type"):
        weight = 25
        total_weight += weight
        if opp["type"] in prefs["opportunityTypes"]:
            score += weight
            criteria_checked.append("Opportunity Type")

    # Location
    if prefs.get("locations") and opp.get("location"):
        weight = 25
        total_weight += weight
        if any(loc.lower() in opp["location"].lower() for loc in prefs["locations"]):
            score += weight
            criteria_checked.append("Location")

    # Stage
    if prefs.get("stages") and opp.get("stage"):
        weight = 20
        total_weight += weight
        if opp["stage"] in prefs["stages"]:
            score += weight
            criteria_checked.append("Stage")

    normalized = round((score / total_weight * 100) if total_weight > 0 else 0, 1)

    if normalized >= 70:
        band = "HIGH"
    elif normalized >= 40:
        band = "MEDIUM"
    else:
        band = "LOW"

    explanation = (
        f"Matches your preferences for: {', '.join(criteria_checked)}."
        if criteria_checked
        else "No preference criteria matched."
    )

    return MatchAssistanceResponse(
        score=normalized,
        relevance_band=band,
        matched_criteria=criteria_checked,
        explanation=explanation,
        disclaimer=(
            "Match scores are preference-based discovery aids. "
            "They do not represent investment suitability or guarantee any outcome."
        ),
    )
