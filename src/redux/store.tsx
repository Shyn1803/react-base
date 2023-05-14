import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

import userReducer from "../slices/user/userSlice";
import loadingReducer from "../slices/loading/loadingSlice";
import usersReducer from "../slices/users/usersSlice";
import articlesReducer from "../slices/articles/articlesSlice";

const persistConfig = {
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
