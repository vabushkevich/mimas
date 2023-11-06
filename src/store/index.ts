import { configureStore } from "@reduxjs/toolkit";
import collapsedThreadIdsReducer from "./collapsedThreadIdsSlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    collapsedThreadIds: collapsedThreadIdsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
