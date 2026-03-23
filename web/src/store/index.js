import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import contentReducer from './contentSlice';
import progressReducer from './progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    progress: progressReducer,
  },
});

export default store;
