import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import supportReducer from './slices/supportSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    support: supportReducer,
    ai: aiReducer,
  },
});
