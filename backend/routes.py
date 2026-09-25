from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

try:
    from processing_layer import MAX_LENGTH, process_text
    from baseline import analyze_baseline
    from prompt import PROMPT_VERSION, build_system_prompt, build_user_message
    from llm_client import get_classification
    from response_schema import ClassificationResponse
except ImportError:  # pragma: no cover - fallback for package-style import
    from backend.processing_layer import MAX_LENGTH, process_text
    from backend.baseline import analyze_baseline
    from backend.prompt import (
        PROMPT_VERSION,
        build_system_prompt,
        build_user_message,
    )
    from backend.llm_client import get_classification
    from backend.response_schema import ClassificationResponse


router = APIRouter()


class ClassifyRequest(BaseModel):
    text: str


def _clean_for_response(wrapped_text: str) -> str:
    """Plain normalized text without <user_text> tags for the frontend."""
    text = wrapped_text.strip()
    if text.startswith("<user_text>"):
        text = text[len("<user_text>"):]
    if text.endswith("</user_text>"):
        text = text[: -len("</user_text>")]
    return text.strip()


@router.get("/health")
def health() -> dict:
    """Return backend status and config."""
    return {
        "service": "SentimentLab",
        "version": PROMPT_VERSION,
        "pipeline": "processing_layer -> VADER baseline -> prompt -> llm_client (Gemini) -> response_schema",
        "model": "Gemini",
        "mode": "Zero-shot",
        "baseline": "VADER",
        "input_language": "English",
        "max_input_length": MAX_LENGTH,
    }



@router.post("/classify")
def classify(payload: ClassifyRequest) -> dict:
    """Classify raw text via the Phase 1 pipeline, in order."""
    raw_text = payload.text

    # 1. Validate input (reject empty, whitespace-only, >2000 chars).
    if raw_text is None or not isinstance(raw_text, str) or not raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Input text is empty or whitespace-only.",
        )
    if len(raw_text) > MAX_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input text exceeds maximum length of {MAX_LENGTH}.",
        )

    # 2. Run process_text() to get normalized/cleaned text.
    try:
        result = process_text(raw_text)
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Processing failed: {error}"
        ) from error
    if not result.is_valid:
        raise HTTPException(
            status_code=400,
            detail=result.error_message or "Invalid input.",
        )

    # Wrapped text (with tags) is internal-only for model/baseline calls.
    wrapped_text = result.processed_text
    # Plain normalized text (no tags) is what the frontend receives.
    clean_text = _clean_for_response(wrapped_text)

    # 3. VADER baseline on wrapped text (same input as Phase 1 main.py).
    try:
        baseline_result = analyze_baseline(wrapped_text)
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Baseline failed: {error}"
        ) from error

    # 4-5. Build Gemini system prompt + user message (wrapped text).
    try:
        system_prompt = build_system_prompt()
        user_message = build_user_message(wrapped_text)
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Prompt failed: {error}"
        ) from error

    # 6. Call Gemini.
    try:
        raw_response = get_classification(system_prompt, user_message)
    except Exception as error:
        raise HTTPException(
            status_code=503, detail=f"Gemini/API unavailable: {error}"
        ) from error

    # 7. Validate Gemini JSON against ClassificationResponse.
    try:
        gemini = ClassificationResponse.model_validate_json(raw_response)
    except Exception as error:
        raise HTTPException(
            status_code=503, detail=f"Invalid Gemini response: {error}"
        ) from error

    # 8-9. Agreement + one structured JSON response (no tags in output).
    return {
        "original_text": result.original_text,
        "processed_text": clean_text,
        "sentiment": gemini.sentiment,
        "emotion": gemini.emotion,
        "confidence_score": gemini.confidence_score,
        "explanation": gemini.explanation,
        "vader_sentiment": baseline_result.vader_sentiment,
        "vader_compound_score": baseline_result.compound_score,
        "agreement": gemini.sentiment == baseline_result.vader_sentiment,
    }