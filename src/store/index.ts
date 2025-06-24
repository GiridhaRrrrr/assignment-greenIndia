import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import uiSlice from './slices/uiSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    ui: uiSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;