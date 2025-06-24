import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import uiSlice from './slices/uiSlice';
import { api } from './api';

// 1. Combine your reducers
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  ui: uiSlice,
  [api.reducerPath]: api.reducer,
});

// 2. Configure persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // persist only selected slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings for redux-persist actions
    }).concat(api.middleware), // DON'T add thunk manually
    devTools: true
});

// 4. Setup listeners for RTK Query
setupListeners(store.dispatch);

// 5. Create persistor
export const persistor = persistStore(store);

// 6. Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
