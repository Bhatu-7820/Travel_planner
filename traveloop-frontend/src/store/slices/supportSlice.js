import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchTickets = createAsyncThunk('support/fetch', async () => {
  const { data } = await api.get('/api/support');
  return data;
});

export const createTicket = createAsyncThunk('support/create', async (payload) => {
  const { data } = await api.post('/api/support', payload);
  return data;
});

export const replyToTicket = createAsyncThunk('support/reply', async ({ id, content, status }) => {
  const { data } = await api.post(`/api/support/${id}/reply`, { content, status });
  return data;
});

const supportSlice = createSlice({
  name: 'support',
  initialState: {
    tickets: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
      })
      .addCase(replyToTicket.fulfilled, (state, action) => {
        const idx = state.tickets.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.tickets[idx] = action.payload;
      });
  },
});

export default supportSlice.reducer;
