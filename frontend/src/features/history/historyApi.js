/**
 * historyApi.js — RTK Query History & Sessions Endpoints
 *
 * Endpoints:
 *  - getFileHistory     GET /api/history/file/:fileId
 *  - getUserSessions    GET /api/history/sessions?page=&limit=&userId=
 */
import { api } from '../../services/apiSlice';

export const historyApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ── GET /api/history/file/:fileId ────────────────────
    getFileHistory: builder.query({
      query: (fileId) => `/history/file/${fileId}`,
      providesTags: (result, error, fileId) => [
        { type: 'History', id: fileId },
      ],
    }),

    // ── GET /api/history/sessions ────────────────────────
    getUserSessions: builder.query({
      query: (params = {}) => ({
        url: '/history/sessions',
        params,
      }),
      providesTags: ['Sessions'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetFileHistoryQuery,
  useGetUserSessionsQuery,
} = historyApi;
