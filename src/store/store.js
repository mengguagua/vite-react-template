import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';
import authBtnReducer from './authBtnSlice';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    authBtn: authBtnReducer,
  }
})
