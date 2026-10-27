import { API_BASE_URL, API_BASE_URL_MISSING } from '../config/api'

const TOKEN_KEY = 'authToken'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// The Go backend serialises primary keys as `id`; large parts of this codebase
// were written against an older API that used `_id`. Aliasing both here keeps
// every existing reader working (including `._id.substring(...)`, which threw on
// undefined) while letting new code standardise on `.id`.
function normalise(value) {
  if (Array.isArray(value)) return value.map(normalise)

  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, item] of Object.entries(value)) out[key] = normalise(item)

    const identifier = out.id ?? out._id
    if (identifier !== undefined && identifier !== null) {
      out.id = String(identifier)
      out._id = String(identifier)
    }

    // Go reports failures as { "error": "..." }; most callers read `.message`.
    if (out.message === undefined && typeof out.error === 'string') out.message = out.error

    return out
  }

  return value
}

export function readError(error, fallback = 'Something went wrong') {
  if (!error) return fallback
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  return error.error || error.message || fallback
}

// A 200 carrying { success: false } is not a success. Treating it as one is how
// an unverified payment was reported as confirmed.
export function isOk(data, response) {
  return Boolean(response?.ok) && data?.success !== false
}

let unauthorizedHandler = null

// Registered by AuthContext so a stale token clears the session and redirects,
// instead of every admin page showing "Failed to fetch".
export function onUnauthorized(handler) {
  unauthorizedHandler = handler
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json().catch(() => null)
  const text = await response.text()
  return text ? { text } : null
}

export async function api(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    headers = {},
    signal,
  } = options

  if (API_BASE_URL_MISSING) {
    throw new ApiError('The server address is not configured for this deployment')
  }

  const requestHeaders = { ...headers }
  const sendBody = body !== undefined && method !== 'GET'

  if (sendBody && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (!token) throw new ApiError('You are not signed in', { status: 401 })
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: sendBody ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal,
    })
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError
    throw new ApiError('Cannot reach the server. Check your connection and try again.')
  }

  const data = normalise(await parseBody(response))

  if (response.status === 401 && auth && unauthorizedHandler) unauthorizedHandler()

  if (!response.ok) {
    throw new ApiError(data?.error || data?.message || `Request failed (${response.status})`, {
      status: response.status,
      data,
    })
  }

  return data
}
