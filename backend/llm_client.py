import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = "gemini-3.8-flash"

def _get_client() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

    return genai.Client(api_key=api_key)

def get_classification(system_prompt: str, processed_text: str) -> str:
    try:
        client = _get_client()

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=processed_text,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
            ),
        )

        return response.text

    except Exception as error:
        raise RuntimeError(
            f"Gemini API request failed: {error}"
        ) from error