from typing import Literal

from pydantic import BaseModel, Field


class ClassificationResponse(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]

    emotion: Literal[
        "joy",
        "sadness",
        "anger",
        "fear",
        "surprise",
        "disgust",
        "neutral",
        "love",
        "sarcasm",
        "gratitude",
        "excitement",
        "hope",
        "pride",
        "relief",
        "contentment",
        "admiration",
        "amusement",
        "disappointment",
        "frustration",
        "anxiety",
        "embarrassment",
        "guilt",
        "shame",
        "boredom",
        "confusion",
        "curiosity",
        "envy",
        "loneliness",
        "nostalgia",
    ]

    confidence_score: float = Field(ge=0.0, le=1.0)

    explanation: str