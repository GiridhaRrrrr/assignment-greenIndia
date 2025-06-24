import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import uiSlice from './slices/uiSlice';
import { api } from './api';

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  ui: uiSlice,
  [api.reducerPath]: api.reducer,
});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // persist only selected slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
    devTools: true
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
