import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from '../../types';

const getSystemPreference = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('theme');
  return (stored as 'light' | 'dark') || getSystemPreference();
};

const initialState: ThemeState = {
  mode: getStoredTheme(),
  systemPreference: getSystemPreference(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
      
      // Update document class
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      localStorage.setItem('theme', newMode);
      
      // Update document class
      if (newMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    updateSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, updateSystemPreference } = themeSlice.actions;

export default themeSlice.reducer;