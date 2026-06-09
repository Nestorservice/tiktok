import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    player: playerReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user.createdAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
