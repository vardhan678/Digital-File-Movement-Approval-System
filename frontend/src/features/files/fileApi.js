/**
 * fileApi.js — RTK Query File CRUD Endpoints
 *
 * Endpoints:
 *  - getFiles       GET  /api/files?page=&limit=&search=&status=&department=&priority=
 *  - getFileById    GET  /api/files/:id
 *  - createFile     POST /api/files        (multipart/form-data)
 *  - updateFile     PUT  /api/files/:id    (multipart/form-data)
 *  - deleteFile     DELETE /api/files/:id
 *
 * Tag strategy:
 *  - getFiles provides ['File'] + individual { type:'File', id } tags
 *  - createFile/updateFile/deleteFile invalidate ['File'] → triggers re-fetch
 */
import { api } from '../../services/apiSlice';

export const fileApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ── GET /api/files ───────────────────────────────────
    getFiles: builder.query({
      query: (params = {}) => ({
        url: '/files',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'File', id: _id })),
              { type: 'File', id: 'LIST' },
            ]
          : [{ type: 'File', id: 'LIST' }],
    }),

    // ── GET /api/files/:id ───────────────────────────────
    getFileById: builder.query({
      query: (id) => `/files/${id}`,
      providesTags: (result, error, id) => [{ type: 'File', id }],
    }),

    // ── POST /api/files ──────────────────────────────────
    createFile: builder.mutation({
      query: (formData) => ({
        url: '/files',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header — browser sets it automatically
        // with the correct multipart boundary for FormData
      }),
      invalidatesTags: [{ type: 'File', id: 'LIST' }, 'Dashboard'],
    }),

    // ── PUT /api/files/:id ───────────────────────────────
    updateFile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/files/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'File', id },
        { type: 'File', id: 'LIST' },
        'Dashboard',
      ],
    }),

    // ── DELETE /api/files/:id ────────────────────────────
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'File', id },
        { type: 'File', id: 'LIST' },
        'Dashboard',
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetFilesQuery,
  useGetFileByIdQuery,
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} = fileApi;
