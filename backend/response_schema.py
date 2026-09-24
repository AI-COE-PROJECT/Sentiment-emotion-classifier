from pydantic import BaseModel
from typing import Literal


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
