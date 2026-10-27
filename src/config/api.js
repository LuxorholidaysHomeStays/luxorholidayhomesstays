const configured = (import.meta.env.VITE_API_BASE_URL || '').trim()

export const API_BASE_URL = configured || (import.meta.env.DEV ? 'http://localhost:9000' : '')
export const API_BASE_URL_MISSING = !API_BASE_URL

export function requireApiBaseUrl() {
  if (API_BASE_URL_MISSING) {
    throw new Error('The server address is not configured for this deployment. Please set VITE_API_BASE_URL.')
  }
}
