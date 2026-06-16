/**
 * apiSlice.js — RTK Query Base API
 *
 * All feature-specific API slices inject their endpoints into this
 * single base using `injectEndpoints`. This keeps one shared cache,
 * one middleware entry, and one reducer in the store.
 *
 * Cookie: The browser automatically sends the HttpOnly `authToken`
 * cookie because `credentials: 'include'` is set on fetchBaseQuery.
 * No manual Authorization headers needed.
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth } from '../features/auth/authSlice';

// ─────────────────────────────────────────────
// Custom base query with global 401 handler
// ─────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',           // Vite proxy forwards /api → http://localhost:5000
  credentials: 'include',    // ✅ Sends HttpOnly cookie automatically
  prepareHeaders: (headers) => {
    // No manual token injection needed — cookie handles auth
    return headers;
  },
});

/**
 * Wraps baseQuery with a global 401 interceptor.
 * On 401: clears Redux auth state + redirects to /login
 */
const baseQueryWithAuthGuard = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const isAuthPage =
      window.location.pathname.includes('/login') ||
      window.location.pathname.includes('/register');

    if (!isAuthPage) {
      api.dispatch(clearAuth());
      window.location.href = '/login';
    }
  }

  return result;
};

// ─────────────────────────────────────────────
// Base API — all feature APIs inject into this
// ─────────────────────────────────────────────
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthGuard,
  /**
   * Tag types used for cache invalidation across all endpoints.
   * When a mutation invalidates a tag, all queries providing that
   * tag are automatically re-fetched.
   */
  tagTypes: ['User', 'File', 'Dashboard', 'History', 'Sessions'],
  endpoints: () => ({}), // Feature slices inject their own endpoints
});

export default api;
