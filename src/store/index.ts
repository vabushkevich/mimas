import { createStore } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { collapsedThreadsReducer } from "./collapsed-threads/reducer"; 

export const store = createStore(
  collapsedThreadsReducer,
  composeWithDevTools(),
);

export type RootState = ReturnType<typeof store.getState>;
