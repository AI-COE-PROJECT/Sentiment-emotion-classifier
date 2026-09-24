import json
import os

import pandas as pd
from sklearn.metrics import accuracy_score, precision_score

from processing_layer import process_text
from baseline import analyze_baseline
from prompt import build_system_prompt, build_user_message
from llm_client import get_classification
from response_schema import ClassificationResponse


def main() -> None:
    base_dir = os.path.dirname(__file__)
    dataset_path = os.path.join(base_dir, "evaluation_dataset.csv")
    results_path = os.path.join(base_dir, "evaluation_results.json")

    df = pd.read_csv(dataset_path)

    true_sentiment_gemini = []
    pred_sentiment_gemini = []

    true_emotion_gemini = []
    pred_emotion_gemini = []

    true_sentiment_vader = []
    pred_sentiment_vader = []

    system_prompt = build_system_prompt()

    for idx, row in df.iterrows():
        text = row["text"]
        true_sentiment = row["sentiment"]
        true_emotion = row["emotion"]

        processing_result = process_text(
            text if isinstance(text, str) else ""
        )

        if not processing_result.is_valid:
            print(
                f"Row {idx} skipped (invalid input): "
                f"{processing_result.error_message}"
            )
            continue

        processed_text = processing_result.processed_text

        vader_result = analyze_baseline(processed_text)

        true_sentiment_vader.append(true_sentiment)
        pred_sentiment_vader.append(vader_result.vader_sentiment)

        try:
            user_message = build_user_message(processed_text)

            raw_response = get_classification(
                system_prompt,
                user_message
            )

            parsed = ClassificationResponse.model_validate_json(
                raw_response
            )

            true_sentiment_gemini.append(true_sentiment)
            pred_sentiment_gemini.append(parsed.sentiment)

            true_emotion_gemini.append(true_emotion)
            pred_emotion_gemini.append(parsed.emotion)

        except Exception as e:
            print(
                f"Row {idx} skipped (Gemini failed): {e}"
            )
            continue

    if true_sentiment_gemini:
        gemini_sentiment_accuracy = accuracy_score(
            true_sentiment_gemini,
            pred_sentiment_gemini
        )

        gemini_sentiment_macro_precision = precision_score(
            true_sentiment_gemini,
            pred_sentiment_gemini,
            average="macro",
            zero_division=0
        )
    else:
        gemini_sentiment_accuracy = 0.0
        gemini_sentiment_macro_precision = 0.0

    if true_sentiment_vader:
        vader_sentiment_accuracy = accuracy_score(
            true_sentiment_vader,
            pred_sentiment_vader
        )

        vader_sentiment_macro_precision = precision_score(
            true_sentiment_vader,
            pred_sentiment_vader,
            average="macro",
            zero_division=0
        )
    else:
        vader_sentiment_accuracy = 0.0
        vader_sentiment_macro_precision = 0.0

    if true_emotion_gemini:
        gemini_emotion_accuracy = accuracy_score(
            true_emotion_gemini,
            pred_emotion_gemini
        )

        gemini_emotion_macro_precision = precision_score(
            true_emotion_gemini,
            pred_emotion_gemini,
            average="macro",
            zero_division=0
        )
    else:
        gemini_emotion_accuracy = 0.0
        gemini_emotion_macro_precision = 0.0

    results = {
        "gemini_sentiment_accuracy": float(gemini_sentiment_accuracy),
        "gemini_sentiment_macro_precision": float(
            gemini_sentiment_macro_precision
        ),
        "vader_sentiment_accuracy": float(vader_sentiment_accuracy),
        "vader_sentiment_macro_precision": float(
            vader_sentiment_macro_precision
        ),
        "gemini_emotion_accuracy": float(gemini_emotion_accuracy),
        "gemini_emotion_macro_precision": float(
            gemini_emotion_macro_precision
        ),
    }

    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)

    print(
        f"Gemini sentiment accuracy: "
        f"{results['gemini_sentiment_accuracy']:.2%}"
    )

    print(
        f"Gemini sentiment macro precision: "
        f"{results['gemini_sentiment_macro_precision']:.2%}"
    )

    print(
        f"VADER sentiment accuracy: "
        f"{results['vader_sentiment_accuracy']:.2%}"
    )

    print(
        f"VADER sentiment macro precision: "
        f"{results['vader_sentiment_macro_precision']:.2%}"
    )

    print(
        f"Gemini emotion accuracy: "
        f"{results['gemini_emotion_accuracy']:.2%}"
    )

    print(
        f"Gemini emotion macro precision: "
        f"{results['gemini_emotion_macro_precision']:.2%}"
    )


if __name__ == "__main__":
    main()