/**
 * approvalApi.js — RTK Query Approval Endpoints
 *
 * Endpoints:
 *  - getPendingFiles   GET /api/approval/pending?page=&limit=&department=&priority=
 *  - performAction     PUT /api/approval/:id/action  { action, remarks }
 *
 * Tag strategy:
 *  - getPendingFiles provides ['File'] tag
 *  - performAction invalidates ['File'] and ['Dashboard']
 *    → both FilesListPage and DashboardPage auto-refresh
 */
import { api } from '../../services/apiSlice';

export const approvalApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ── GET /api/approval/pending ────────────────────────
    getPendingFiles: builder.query({
      query: (params = {}) => ({
        url: '/approval/pending',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'File', id: _id })),
              { type: 'File', id: 'PENDING' },
            ]
          : [{ type: 'File', id: 'PENDING' }],
    }),

    // ── PUT /api/approval/:id/action ─────────────────────
    performAction: builder.mutation({
      query: ({ id, action, remarks }) => ({
        url: `/approval/${id}/action`,
        method: 'PUT',
        body: { action, remarks },
      }),
      // Invalidate all file caches and dashboard so everything re-fetches
      invalidatesTags: (result, error, { id }) => [
        { type: 'File', id },
        { type: 'File', id: 'LIST' },
        { type: 'File', id: 'PENDING' },
        'Dashboard',
        'History',
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetPendingFilesQuery,
  usePerformActionMutation,
} = approvalApi;
