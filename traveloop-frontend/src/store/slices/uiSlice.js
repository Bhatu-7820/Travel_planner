import { createSlice } from '@reduxjs/toolkit';

const theme = localStorage.getItem('traveloop_theme') || 'light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('traveloop_theme', state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('traveloop_theme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
