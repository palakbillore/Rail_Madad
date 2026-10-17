/**
 * Centralized API configuration and request helpers.
 * Swap BASE_URL for production when deploying.
 */

const BASE_URL = 'http://localhost:8000/api';

/**
 * Core request function with auth header injection.
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('rm_token')

    const isFormData = options.body instanceof FormData

    const { headers: customHeaders, ...restOptions } = options;

    const config = {
        ...restOptions,
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` }),
            ...customHeaders,
        },
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
}

// ── Convenience methods ───────────────────────────────────────────────

export const api = {
    get: (endpoint) => request(endpoint, { method: 'GET' }),

    post: (endpoint, data) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    put: (endpoint, data) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    patch: (endpoint, data) =>
        request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

    /**
     * Upload files via FormData (no JSON content-type).
     */
    upload: (endpoint, formData) =>
        request(endpoint, {
            method: 'POST',
            body: formData,
            credentials: "include",
            // DO NOT set Content-Type manually for FormData.
            // The browser will automatically set it to 'multipart/form-data; boundary=...'
        }),
}

export default api
