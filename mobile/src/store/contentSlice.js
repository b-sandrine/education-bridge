import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  selectedCourse: null,
  lessons: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  selectCourse,
  setLessons,
} = contentSlice.actions;
export default contentSlice.reducer;
