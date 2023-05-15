import { configureStore } from "@reduxjs/toolkit";
// import storage from 'redux-persist/lib/storage';
import { Persistor, persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import userReducer from "../slices/user/userSlice";
import loadingReducer from "../slices/loading/loadingSlice";
import usersReducer from "../slices/users/usersSlice";
import articlesReducer from "../slices/articles/articlesSlice";

const createNoopStorage = () => {
  return {
    getIten(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removelten(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig: any = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    loading: loadingReducer,
    users: usersReducer,
    articles: articlesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor: Persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
