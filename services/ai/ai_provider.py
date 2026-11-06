"""
AI provider interface. Keeps the model/provider abstracted so it can be swapped.
Currently implements OpenAI-compatible providers.
"""
import json
import logging
from typing import Optional
from openai import OpenAI, APIError, APITimeoutError
from config import settings

logger = logging.getLogger(__name__)

DISCLAIMER = (
    "AI-generated assistance based on submitted information only. "
    "This content has not been independently verified and does not constitute "
    "investment advice or a guarantee of any business outcome."
)


def get_client() -> Optional[OpenAI]:
    """Return an OpenAI client if credentials are configured."""
    if not settings.AI_PROVIDER_API_KEY:
        return None
    return OpenAI(api_key=settings.AI_PROVIDER_API_KEY, timeout=settings.REQUEST_TIMEOUT)


def analyze_opportunity(data: dict) -> dict:
    """
    Call the AI provider to generate a structured analysis.
    Falls back to rule-based analysis if no API key is configured (dev mode).
    """
    client = get_client()

    if client is None:
        logger.warning("No AI_PROVIDER_API_KEY configured. Returning mock analysis for development.")
        return _mock_analysis(data)

    prompt = _build_analysis_prompt(data)

    try:
        response = client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an assistant helping to organize and summarize investment opportunity submissions. "
                        "You must respond only with valid JSON matching the schema provided. "
                        "Never invent facts. Only analyze what is explicitly provided. "
                        "Never present AI analysis as verification or financial advice."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=settings.MAX_TOKENS,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        result = json.loads(raw)
        result["model_identifier"] = settings.AI_MODEL
        result["disclaimer"] = DISCLAIMER
        return _validate_analysis_result(result)

    except APITimeoutError:
        logger.error("AI provider request timed out.")
        raise RuntimeError("AI analysis timed out. Please retry.")
    except APIError as e:
        logger.error(f"AI provider API error: {e}")
        raise RuntimeError(f"AI provider error: {str(e)}")
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {e}")
        raise RuntimeError("AI returned an invalid response format.")


def _build_analysis_prompt(data: dict) -> str:
    parts = [
        f"Opportunity Title: {data.get('title', 'Not provided')}",
        f"Type: {data.get('type', 'Not provided')}",
        f"Sector: {data.get('sector') or 'Not specified'}",
        f"Location: {data.get('location') or 'Not specified'}",
        f"Stage: {data.get('stage') or 'Not specified'}",
        f"Description: {data.get('description', 'Not provided')}",
    ]
    if data.get("problem"):
        parts.append(f"Problem: {data['problem']}")
    if data.get("solution"):
        parts.append(f"Solution: {data['solution']}")
    if data.get("goals"):
        parts.append(f"Goals: {data['goals']}")

    opportunity_text = "\n".join(parts)

    return f"""
Analyze the following opportunity submission and return a JSON object with these fields:
- summary (string): A concise 2-3 sentence summary based ONLY on the submitted information
- categories (array of strings): 1-3 relevant category/sector tags
- missing_information (array of strings): Key information that was not provided but would be useful
- suggested_questions (array of strings): 2-4 follow-up questions for the submitter

IMPORTANT:
- Base your response ONLY on the provided information
- Do not invent, assume, or add facts not in the submission
- Keep the summary neutral and factual
- Do not include investment recommendations or guarantees

Opportunity:
{opportunity_text}

Respond with valid JSON only.
"""


def _validate_analysis_result(result: dict) -> dict:
    """Ensure the AI response has all required fields."""
    return {
        "summary": str(result.get("summary", "Summary not available.")),
        "categories": [str(c) for c in result.get("categories", [])][:5],
        "missing_information": [str(m) for m in result.get("missing_information", [])][:10],
        "suggested_questions": [str(q) for q in result.get("suggested_questions", [])][:6],
        "disclaimer": DISCLAIMER,
        "model_identifier": result.get("model_identifier"),
    }


def _mock_analysis(data: dict) -> dict:
    """Rule-based fallback analysis for development without API keys."""
    title = data.get("title", "")
    opp_type = data.get("type", "BUSINESS")
    sector = data.get("sector")
    location = data.get("location")
    stage = data.get("stage")

    missing = []
    questions = []

    if not data.get("problem"):
        missing.append("Problem statement was not provided.")
        questions.append("What specific problem does this opportunity address?")
    if not data.get("solution"):
        missing.append("Proposed solution or value proposition was not provided.")
        questions.append("What is the proposed solution or unique value proposition?")
    if not sector:
        missing.append("Sector/category was not specified.")
    if not stage:
        missing.append("Current stage was not specified.")
        questions.append("What is the current development stage?")
    if not data.get("goals"):
        questions.append("What are the primary goals and expected outcomes?")

    categories = [sector] if sector else []
    if opp_type == "TALENT":
        categories.append("Human Capital")
    elif opp_type == "IDEA":
        categories.append("Innovation")

    summary = (
        f"This is a {opp_type.lower()} opportunity titled '{title}'"
        f"{' in the ' + sector + ' sector' if sector else ''}"
        f"{' based in ' + location if location else ''}. "
        "Further details can be found in the full submission."
    )

    return {
        "summary": summary,
        "categories": list(set(filter(None, categories))),
        "missing_information": missing,
        "suggested_questions": questions[:4],
        "disclaimer": DISCLAIMER,
        "model_identifier": "mock-rule-based-v1",
    }
