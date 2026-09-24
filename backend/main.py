from processing_layer import process_text
from baseline import analyze_baseline
from prompt import build_system_prompt, build_user_message
from llm_client import get_classification
from response_schema import ClassificationResponse


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

    print(f"Gemini sentiment: {gemini_result.sentiment}")
    print(f"Gemini emotion: {gemini_result.emotion}")
    print(f"VADER sentiment: {baseline_result.vader_sentiment}")
    print(f"VADER compound score: {baseline_result.compound_score}")


if __name__ == "__main__":
    main()
