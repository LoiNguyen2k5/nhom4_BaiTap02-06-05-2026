import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import passwordReducer from './passwordSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    password: passwordReducer,
  },
});
