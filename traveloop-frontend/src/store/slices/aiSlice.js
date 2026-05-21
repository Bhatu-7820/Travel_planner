import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '@/services/aiService';

// Async Thunks
export const fetchChatHistory = createAsyncThunk(
  'ai/fetchChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await aiService.getChatHistory();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  'ai/clearChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await aiService.clearChatHistory();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'ai/sendChatMessage',
  async ({ message, context }, { rejectWithValue }) => {
    try {
      return await aiService.chatWithAI(message, context);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const generateItinerary = createAsyncThunk(
  'ai/generateItinerary',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.generateItinerary(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const generateBudget = createAsyncThunk(
  'ai/generateBudget',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.generateBudget(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const recommendDestinations = createAsyncThunk(
  'ai/recommendDestinations',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.recommendDestinations(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const recommendHotels = createAsyncThunk(
  'ai/recommendHotels',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.recommendHotels(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const generatePackingList = createAsyncThunk(
  'ai/generatePackingList',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.generatePackingList(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const optimizeTrip = createAsyncThunk(
  'ai/optimizeTrip',
  async (payload, { rejectWithValue }) => {
    try {
      return await aiService.optimizeTrip(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAIAnalytics = createAsyncThunk(
  'ai/fetchAIAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await aiService.getAnalytics();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  chatHistory: [],
  generatedItinerary: null,
  generatedBudget: null,
  recommendedDestinations: null,
  recommendedHotels: null,
  generatedPackingList: null,
  optimizedRoute: null,
  analytics: null,
  
  // Loading & Error States
  chatStatus: 'idle',
  itineraryStatus: 'idle',
  budgetStatus: 'idle',
  destinationStatus: 'idle',
  hotelStatus: 'idle',
  packingStatus: 'idle',
  optimizeStatus: 'idle',
  analyticsStatus: 'idle',
  
  error: null
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearItinerary(state) {
      state.generatedItinerary = null;
      state.itineraryStatus = 'idle';
    },
    clearBudget(state) {
      state.generatedBudget = null;
      state.budgetStatus = 'idle';
    },
    clearRecommendations(state) {
      state.recommendedDestinations = null;
      state.destinationStatus = 'idle';
      state.recommendedHotels = null;
      state.hotelStatus = 'idle';
    },
    clearPackingList(state) {
      state.generatedPackingList = null;
      state.packingStatus = 'idle';
    },
    clearOptimization(state) {
      state.optimizedRoute = null;
      state.optimizeStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chat History
      .addCase(fetchChatHistory.pending, (state) => {
        state.chatStatus = 'loading';
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatStatus = 'succeeded';
        // Always ensure chatHistory is an array
        state.chatHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.chatStatus = 'failed';
        state.error = action.payload;
      })
      // Clear Chat History
      .addCase(clearChatHistory.pending, (state) => {
        state.chatStatus = 'loading';
      })
      .addCase(clearChatHistory.fulfilled, (state) => {
        state.chatStatus = 'succeeded';
        state.chatHistory = [];
      })
      .addCase(clearChatHistory.rejected, (state, action) => {
        state.chatStatus = 'failed';
        state.error = action.payload;
      })
      // Send Chat Message
      .addCase(sendChatMessage.pending, (state, action) => {
        state.chatStatus = 'loading';
        // Optimistically add user message with typing indicator
        const msg = action.meta?.arg?.message;
        if (msg) {
          if (!Array.isArray(state.chatHistory)) state.chatHistory = [];
          state.chatHistory.push({
            _id: `temp_${Date.now()}`,
            userId: 'me',
            message: msg,
            reply: '...',
            createdAt: new Date().toISOString()
          });
        }
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatStatus = 'succeeded';
        if (!Array.isArray(state.chatHistory)) state.chatHistory = [];
        // Replace the last optimistic message with real response
        if (action.payload && state.chatHistory.length > 0) {
          state.chatHistory[state.chatHistory.length - 1] = action.payload;
        } else if (action.payload) {
          state.chatHistory.push(action.payload);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.chatStatus = 'failed';
        state.error = action.payload;
        if (!Array.isArray(state.chatHistory)) state.chatHistory = [];
        // Update the last optimistic message to show the error
        if (state.chatHistory.length > 0) {
          const last = state.chatHistory[state.chatHistory.length - 1];
          if (last) last.reply = `⚠️ ${action.payload || 'AI unavailable. Please try again.'}`;
        }
      })
      // Generate Itinerary
      .addCase(generateItinerary.pending, (state) => {
        state.itineraryStatus = 'loading';
      })
      .addCase(generateItinerary.fulfilled, (state, action) => {
        state.itineraryStatus = 'succeeded';
        state.generatedItinerary = action.payload;
      })
      .addCase(generateItinerary.rejected, (state, action) => {
        state.itineraryStatus = 'failed';
        state.error = action.payload;
      })
      // Generate Budget
      .addCase(generateBudget.pending, (state) => {
        state.budgetStatus = 'loading';
      })
      .addCase(generateBudget.fulfilled, (state, action) => {
        state.budgetStatus = 'succeeded';
        state.generatedBudget = action.payload;
      })
      .addCase(generateBudget.rejected, (state, action) => {
        state.budgetStatus = 'failed';
        state.error = action.payload;
      })
      // Recommend Destinations
      .addCase(recommendDestinations.pending, (state) => {
        state.destinationStatus = 'loading';
      })
      .addCase(recommendDestinations.fulfilled, (state, action) => {
        state.destinationStatus = 'succeeded';
        state.recommendedDestinations = action.payload;
      })
      .addCase(recommendDestinations.rejected, (state, action) => {
        state.destinationStatus = 'failed';
        state.error = action.payload;
      })
      // Recommend Hotels
      .addCase(recommendHotels.pending, (state) => {
        state.hotelStatus = 'loading';
      })
      .addCase(recommendHotels.fulfilled, (state, action) => {
        state.hotelStatus = 'succeeded';
        state.recommendedHotels = action.payload;
      })
      .addCase(recommendHotels.rejected, (state, action) => {
        state.hotelStatus = 'failed';
        state.error = action.payload;
      })
      // Generate Packing List
      .addCase(generatePackingList.pending, (state) => {
        state.packingStatus = 'loading';
      })
      .addCase(generatePackingList.fulfilled, (state, action) => {
        state.packingStatus = 'succeeded';
        state.generatedPackingList = action.payload;
      })
      .addCase(generatePackingList.rejected, (state, action) => {
        state.packingStatus = 'failed';
        state.error = action.payload;
      })
      // Optimize Trip
      .addCase(optimizeTrip.pending, (state) => {
        state.optimizeStatus = 'loading';
      })
      .addCase(optimizeTrip.fulfilled, (state, action) => {
        state.optimizeStatus = 'succeeded';
        state.optimizedRoute = action.payload;
      })
      .addCase(optimizeTrip.rejected, (state, action) => {
        state.optimizeStatus = 'failed';
        state.error = action.payload;
      })
      // Fetch AI Analytics
      .addCase(fetchAIAnalytics.pending, (state) => {
        state.analyticsStatus = 'loading';
      })
      .addCase(fetchAIAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(fetchAIAnalytics.rejected, (state, action) => {
        state.analyticsStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  clearItinerary,
  clearBudget,
  clearRecommendations,
  clearPackingList,
  clearOptimization
} = aiSlice.actions;

export default aiSlice.reducer;
