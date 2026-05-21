import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';

let initialUser = null;
try {
  const saved = localStorage.getItem('traveloop_user');
  if (saved) initialUser = JSON.parse(saved);
} catch (err) {
  localStorage.removeItem('traveloop_user');
}

const initialState = {
  user: initialUser,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => authService.login(credentials));
export const registerUser = createAsyncThunk('auth/registerUser', async (payload) => authService.register(payload));
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => authService.me());

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('traveloop_user');
      localStorage.removeItem('traveloop_token');
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      localStorage.setItem('traveloop_user', JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem('traveloop_token', action.payload.token);
      }
    },
    updateProfile(state, action) {
      state.user = action.payload;
      localStorage.setItem('traveloop_user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    const assignFulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      localStorage.setItem('traveloop_user', JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem('traveloop_token', action.payload.token);
      }
    };

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, assignFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, assignFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data || action.payload;
        localStorage.setItem('traveloop_user', JSON.stringify(state.user));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        localStorage.removeItem('traveloop_user');
        localStorage.removeItem('traveloop_token');
      });
  },
});

export const { logout, setCredentials, updateProfile } = authSlice.actions;
export default authSlice.reducer;
