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
  },
});

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  setCourseProgress,
} = progressSlice.actions;
export default progressSlice.reducer;
