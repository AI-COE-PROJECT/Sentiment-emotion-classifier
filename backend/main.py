from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from routes import router
    from processing_layer import process_text
    from baseline import analyze_baseline
    from prompt import build_system_prompt, build_user_message
    from llm_client import get_classification
    from response_schema import ClassificationResponse
except ImportError:
    from backend.routes import router
    from backend.processing_layer import process_text
    from backend.baseline import analyze_baseline
    from backend.prompt import build_system_prompt, build_user_message
    from backend.llm_client import get_classification
    from backend.response_schema import ClassificationResponse

app = FastAPI(title="SentimentLab")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


def main() -> None:
    raw_text = input("Enter text to classify: ")

    processing_result = process_text(raw_text)

    if not processing_result.is_valid:
        print(f"Invalid input: {processing_result.error_message}")
        return

    processed_text = processing_result.processed_text

    baseline_result = analyze_baseline(processed_text)

    system_prompt = build_system_prompt()
    user_message = build_user_message(processed_text)

    try:
        raw_response = get_classification(system_prompt, user_message)
        gemini_result = ClassificationResponse.model_validate_json(raw_response)
    except Exception as e:
        print(f"Gemini classification failed: {e}")
        return

    agreement = (
        gemini_result.sentiment == baseline_result.vader_sentiment
    )

    print(f"Gemini sentiment: {gemini_result.sentiment}")
    print(f"Gemini emotion: {gemini_result.emotion}")
    print(f"Gemini confidence: {gemini_result.confidence_score}")
    print(f"Gemini explanation: {gemini_result.explanation}")
    print(f"VADER sentiment: {baseline_result.vader_sentiment}")
    print(f"VADER compound score: {baseline_result.compound_score}")
    print(f"Agreement: {agreement}")


if __name__ == "__main__":
    main()