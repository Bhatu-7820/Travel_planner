import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await api.get('/api/notifications');
  return data;
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id) => {
  await api.put(`/api/notifications/${id}/read`);
  return id;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.items.find(n => n._id === action.payload);
        if (notif) notif.read = true;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
