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
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  selectCourse,
  setLessons,
  addCourse,
  updateCourse,
} = contentSlice.actions;
export default contentSlice.reducer;
