import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    login: (state, action) => {
      const user = {
        id: uuid(),
        ...action.payload,
      };

      return { ...state, user };
    },
    logout: (state, action: LogoutAction) => {
      const user = {};

      return { ...state, user };
    },
    updateUser: (state, action) => {
      const user = {
        id: uuid(),
        ...action.payload,
      };

      return { ...state, user };
    },
  },
});

type LogoutAction = {
  payload?: any,
  type: string
}

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
