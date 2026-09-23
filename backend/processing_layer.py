import re
import unicodedata
from dataclasses import dataclass

MAX_LENGTH = 2000


class ValidationError(Exception):
    pass


@dataclass
class ProcessingResult:
    original_text: str
    normalized_text: str
    processed_text: str
    is_valid: bool
    error_message: str | None = None


def _validate(text: str) -> None:
    
    if text is None:
        raise ValidationError("Input text is missing.")

    if not text.strip():
        raise ValidationError("Input text is empty or whitespace-only.")

    if len(text) > MAX_LENGTH:
        raise ValidationError(
            f"Input text exceeds maximum length of {MAX_LENGTH} characters."
        )


def _normalize_unicode(text: str) -> str:
    return unicodedata.normalize("NFKC", text)


def _light_clean(text: str) -> str:
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def _wrap_safely(text: str) -> str:
    return f"<user_text>\n{text}\n</user_text>"


def process_text(raw_text: str) -> ProcessingResult:
    try:
        _validate(raw_text)
    except ValidationError as e:
        return ProcessingResult(
            original_text=raw_text if raw_text is not None else "",
            normalized_text="",
            processed_text="",
            is_valid=False,
            error_message=str(e),
        )

    normalized = _normalize_unicode(raw_text)
    cleaned = _light_clean(normalized)
    processed = _wrap_safely(cleaned)

    return ProcessingResult(
        original_text=raw_text,
        normalized_text=normalized,
        processed_text=processed,
        is_valid=True,
        error_message=None,
    )