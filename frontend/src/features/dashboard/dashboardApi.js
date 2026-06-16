/**
 * dashboardApi.js — RTK Query Dashboard Endpoint
 *
 * Endpoints:
 *  - getDashboardStats   GET /api/dashboard/stats
 *
 * Cache: provides ['Dashboard'] tag.
 * Invalidated by: createFile, updateFile, deleteFile, performAction.
 *
 * keepUnusedDataFor: 60 seconds — dashboard data stays cached
 * for 1 minute after the component unmounts, so navigating away
 * and back doesn't trigger a full re-fetch.
 */
import { api } from '../../services/apiSlice';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60, // seconds
    }),

  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
