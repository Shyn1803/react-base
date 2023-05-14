import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    status: false,
    count: 0,
    statusLoadingComponent: false,
    countLoadingComponent: 0,
  },
  reducers: {
    showLoading: (state, action) => {
      let { count, status } = state;

      if (++count === 1) {
        status = true;
      }

      return { ...state, status, count };
    },

    hideLoading: (state, action) => {
      let { count, status } = state;

      if (count === 0 || --count === 0) {
        status = false;
      }

      return { ...state, status, count };
    },

    resetLoading: (state, action) => {
      const count = 0;
      const status = false;

      return { ...state, status, count };
    },
  },
});

export const {
  showLoading,
  hideLoading,
  resetLoading
} = loadingSlice.actions;

export default loadingSlice.reducer;
