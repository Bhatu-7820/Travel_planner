import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tripService } from '@/services/tripService';

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => tripService.getTrips());
export const fetchTripById = createAsyncThunk('trips/fetchTripById', async (id) => tripService.getTripById(id));
export const createTrip = createAsyncThunk('trips/createTrip', async (payload) => tripService.createTrip(payload));
export const updateTrip = createAsyncThunk('trips/updateTrip', async ({ id, payload }) => tripService.updateTrip(id, payload));
export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id) => {
  await tripService.deleteTrip(id);
  return id;
});
export const uploadTripImages = createAsyncThunk('trips/uploadImages', async ({ id, images }) => tripService.uploadImages(id, images));

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    currentTrip: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentTrip(state, action) {
      state.currentTrip = action.payload;
    },
    clearCurrentTrip(state) {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trips = action.payload.map(t => ({ ...t, id: t._id }));
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        const trip = action.payload;
        if (trip) {
          trip.id = trip._id;
          trip.stops = (trip.stops || []).map(s => ({
            ...s,
            id: s._id,
            activities: (s.activities || []).map(a => ({ ...a, id: a._id }))
          }));
        }
        state.currentTrip = trip;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        const trip = { ...action.payload, id: action.payload._id };
        state.trips.unshift(trip);
        state.currentTrip = trip;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const trip = { ...action.payload, id: action.payload._id };
        const idx = state.trips.findIndex((t) => t.id === trip.id);
        if (idx >= 0) state.trips[idx] = trip;
        if (state.currentTrip?.id === trip.id) state.currentTrip = trip;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
        if (state.currentTrip?.id === action.payload) state.currentTrip = null;
      })
      .addCase(uploadTripImages.fulfilled, (state, action) => {
        const trip = { ...action.payload, id: action.payload._id };
        if (state.currentTrip?.id === trip.id) state.currentTrip = trip;
        const idx = state.trips.findIndex(t => t.id === trip.id);
        if (idx !== -1) state.trips[idx] = trip;
      });
  },
});

export const { setCurrentTrip, clearCurrentTrip } = tripSlice.actions;
export default tripSlice.reducer;
