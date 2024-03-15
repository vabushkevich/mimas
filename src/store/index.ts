import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "./commentsSlice";
import onScreenMediaIdsReducer from "./onScreenMediaIdsSlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    comments: commentsReducer,
    onScreenMediaIds: onScreenMediaIdsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
