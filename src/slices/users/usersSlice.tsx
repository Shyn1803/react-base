import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
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

    saveUsers: (state, action) => {
      let users: any[] = [];
      if (action.payload?.length > 0) {
        users = [...action.payload];
      } else {
        users = []
      }

      return { ...state, data: users };
    },
  },
});

export const { showLoading, hideLoading, resetLoading, saveUsers } =
  usersSlice.actions;

export default usersSlice.reducer;
