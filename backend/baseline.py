from dataclasses import dataclass
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer


POSITIVE_THRESHOLD = 0.05
NEGATIVE_THRESHOLD = -0.05


@dataclass
class BaselineResult:
    compound_score: float
    vader_sentiment: str


try:
    nltk.data.find("sentiment/vader_lexicon.zip")
except LookupError:
    nltk.download("vader_lexicon")


analyzer = SentimentIntensityAnalyzer()


def analyze_baseline(processed_text: str) -> BaselineResult:
    scores = analyzer.polarity_scores(processed_text)
    compound = scores["compound"]

    if compound >= POSITIVE_THRESHOLD:
        sentiment = "positive"
    elif compound <= NEGATIVE_THRESHOLD:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return BaselineResult(
        compound_score=compound,
        vader_sentiment=sentiment
    )