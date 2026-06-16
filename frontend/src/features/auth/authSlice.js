/**
 * authSlice.js — Auth UI State Only (No Thunks)
 *
 * This slice only manages:
 *  - user: the logged-in user object (populated by authApi)
 *  - isAuthenticated: boolean flag
 *  - initializing: true while app is checking the cookie on first load
 *
 * ❌ NO createAsyncThunk
 * ❌ NO token in state (token lives in HttpOnly cookie)
 * ✅ Data is set by authApi's onQueryStarted lifecycle hooks
 */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    initializing: true, // true until getMe query resolves on first load
  },
  reducers: {
    /**
     * Called by authApi (login, register, getMe) on success.
     * Stores the user and marks app as authenticated.
     */
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initializing = false;
    },

    /**
     * Called by:
     *  - authApi logout mutation (on success)
     *  - apiSlice global 401 interceptor (token expired)
     * Clears all auth state.
     */
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.initializing = false;
    },

    /**
     * Called after getMe query settles (success OR failure)
     * so the app stops showing the loading spinner.
     */
    setInitializing: (state, action) => {
      state.initializing = action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setInitializing } = authSlice.actions;
export default authSlice.reducer;
