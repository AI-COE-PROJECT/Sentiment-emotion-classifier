/**
 * API service for the SentimentLab frontend.
 *
 * This is the ONLY module in the frontend that knows how HTTP works.
 * React components call `classifyText(text)` / `getHealth()` and never use
 * `fetch()` themselves, so the UI stays independent from the backend.
 *
 * The API contract (Layer 2) is:
 *   POST /classify  -> { text, llm: { sentiment, emotion, confidence, reasoning },
 *                        vader: { sentiment, compound }, metrics?: { accuracy, macro_precision } }
 *   GET  /health    -> { status, service, version, pipeline, model, mode, baseline,
 *                        input_language, max_input_length }
 *
 * `metrics` is an optional additive field used by the four top metric cards.
 * When the backend does not send it, the cards simply keep showing "--".
 *
 * The API base URL can be overridden with a Vite env variable:
 *   VITE_API_BASE_URL=http://127.0.0.1:8000
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
).replace(/\/+$/, '')

const REQUEST_TIMEOUT_MS = 30000

/** Error type used for every failure so components can display one message shape. */
export class ApiError extends Error {
  constructor(message, { status = 0, detail = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

/** Turns any backend error payload into a single readable message for the UI. */
function toReadableMessage(response, payload) {
  const detail = payload?.detail

  // FastAPI HTTPException(...) with a plain-string detail (our validation errors).
  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  // FastAPI/Pydantic 422 validation payload: [{ loc, msg, type }, ...]
  if (Array.isArray(detail) && detail.length > 0) {
    const firstMessage = detail.find((item) => item && typeof item.msg === 'string')
    return firstMessage ? `Input is invalid. ${firstMessage.msg}` : 'Input is invalid.'
  }

  if (response.status === 404) {
    return 'The classification endpoint was not found on the backend service.'
  }
  if (response.status >= 500) {
    return 'The classification service is temporarily unavailable. Please try again.'
  }
  return `The classification service rejected the request (status ${response.status}).`
}

/** Small fetch wrapper: timeout handling, JSON parsing and error normalisation. */
async function request(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiError('The classification service took too long to respond.')
    }
    throw new ApiError(
      'Unable to reach the classification service. Make sure the FastAPI backend is running.',
    )
  } finally {
    clearTimeout(timeoutId)
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError(toReadableMessage(response, payload), {
      status: response.status,
      detail: payload?.detail ?? null,
    })
  }

  if (payload === null) {
    throw new ApiError('The classification service returned an unreadable response.')
  }

  return payload
}

/** GET /health — used for the "Backend Connected" indicator and service labels. */
export function getHealth() {
  return request('/health')
}

/**
 * POST /classify — classifies one piece of text.
 * @param {string} text raw user text
 */
export function classifyText(text) {
  return request('/classify', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
