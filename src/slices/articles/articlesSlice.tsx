import { createSlice } from "@reduxjs/toolkit";

export const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    loadingStatus: false,
    count: 0,
  },
  reducers: {
    showLoading: (state) => {
      let { count, loadingStatus } = state;

      if (++count === 1) {
        loadingStatus = true;
      }

      return { ...state, loadingStatus, count };
    },

    hideLoading: (state) => {
      let { count, loadingStatus } = state;

      if (count === 0 || --count === 0) {
        loadingStatus = false;
      }

      return { ...state, loadingStatus, count };
    },

    resetLoading: (state) => {
      const count = 0;
      const loadingStatus = false;

      return { ...state, loadingStatus, count };
    },
  },
});

export const { showLoading, hideLoading, resetLoading } =
  articlesSlice.actions;

export default articlesSlice.reducer;
