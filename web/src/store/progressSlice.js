import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProgress: [],
  courseProgress: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    fetchProgressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProgressSuccess: (state, action) => {
      state.loading = false;
      state.userProgress = action.payload;
    },
    fetchProgressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCourseProgress: (state, action) => {
      state.courseProgress = action.payload;
    },
    updateProgressOptimistic: (state, action) => {
      const index = state.userProgress.findIndex(p => p.course_id === action.payload.course_id);
      if (index !== -1) {
        state.userProgress[index] = action.payload;
      }
    },
  },
});

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  setCourseProgress,
  updateProgressOptimistic,
} = progressSlice.actions;
export default progressSlice.reducer;
