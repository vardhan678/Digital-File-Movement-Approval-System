/**
 * authApi.js — RTK Query Auth Endpoints
 *
 * Injects login, register, logout, and getMe endpoints into the
 * shared base `api`. After a successful login/register, the
 * `onQueryStarted` lifecycle updates the Redux authSlice with user data.
 */
import { api } from '../../services/apiSlice';
import { setCredentials, clearAuth } from './authSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ── POST /api/auth/login ─────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      /**
       * On success: store user data in Redux authSlice.
       * The JWT is stored in the HttpOnly cookie by the backend —
       * we never touch it from JavaScript.
       */
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data.data = { _id, name, email, role, department }
          dispatch(setCredentials(data.data));
        } catch {
          // Error handled by the component via isError / error
        }
      },
      invalidatesTags: ['Dashboard'],
    }),

    // ── POST /api/auth/register ──────────────────────────
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          // handled in component
        }
      },
    }),

    // ── POST /api/auth/logout ────────────────────────────
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear Redux state regardless of API success/failure
          dispatch(clearAuth());
          // RTK Query resets all cached data
          dispatch(api.util.resetApiState());
        }
      },
    }),

    // ── GET /api/auth/me ─────────────────────────────────
    /**
     * Called on app mount (App.jsx) to validate the HttpOnly cookie
     * and populate the Redux store with fresh user data from DB.
     * Replaces the old `fetchMeThunk`.
     */
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          // Cookie invalid/expired — clearAuth handled by 401 interceptor in apiSlice
        }
      },
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
