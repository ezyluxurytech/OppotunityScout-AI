"""
Pydantic schemas for the AI service request/response contracts.
All incoming data is untrusted and validated here.
"""
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class OpportunityAnalysisRequest(BaseModel):
    opportunity_id: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=500)
    type: str = Field(..., pattern="^(BUSINESS|IDEA|TALENT)$")
    description: str = Field(..., min_length=1, max_length=10000)
    sector: Optional[str] = Field(None, max_length=200)
    location: Optional[str] = Field(None, max_length=200)
    stage: Optional[str] = Field(None, max_length=100)
    problem: Optional[str] = Field(None, max_length=5000)
    solution: Optional[str] = Field(None, max_length=5000)
    goals: Optional[str] = Field(None, max_length=5000)

    @field_validator("title", "description", mode="before")
    @classmethod
    def strip_and_limit(cls, v):
        if isinstance(v, str):
            return v.strip()[:10000]
        return v


class OpportunityAnalysisResponse(BaseModel):
    summary: str
    categories: List[str]
    missing_information: List[str]
    suggested_questions: List[str]
    disclaimer: str
    model_identifier: Optional[str] = None


class MatchAssistanceRequest(BaseModel):
    investor_preferences: dict
    opportunity: dict


class MatchAssistanceResponse(BaseModel):
    score: float = Field(..., ge=0, le=100)
    relevance_band: str
    matched_criteria: List[str]
    explanation: str
    disclaimer: str


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str = "opportunityscout-ai-service"
