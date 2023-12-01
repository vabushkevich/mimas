import { configureStore } from "@reduxjs/toolkit";
import collapsedThreadIdsReducer from "./collapsedThreadIdsSlice";
import onScreenMediaIdsReducer from "./onScreenMediaIdsSlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    collapsedThreadIds: collapsedThreadIdsReducer,
    onScreenMediaIds: onScreenMediaIdsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
