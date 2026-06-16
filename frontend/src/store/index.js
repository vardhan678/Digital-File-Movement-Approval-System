/**
 * store/index.js — Redux Store Configuration
 *
 * Changes from original:
 *  ✅ Removed dashboardSlice (managed by RTK Query cache)
 *  ✅ Removed fileSlice (managed by RTK Query cache)
 *  ✅ Added api.reducer and api.middleware (RTK Query)
 *  ✅ authSlice still persisted (but whitelist is empty — token in cookie)
 *  ✅ redux-persist kept for future extensibility
 *
 * Import the NEW authSlice from features/auth/authSlice:
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../features/auth/authSlice';
import { api } from '../services/apiSlice';

// Auth persist config — whitelist is empty.
// Token lives in HttpOnly cookie; user is fetched fresh via getMe.
const authPersistConfig = {
  key: 'digitalfile_auth',
  storage,
  whitelist: [], // Nothing persisted to localStorage
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // RTK Query stores all server data in api.reducer
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions are non-serializable — ignore them
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    // RTK Query middleware handles cache lifecycle, polling, invalidation
    .concat(api.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
export default store;
