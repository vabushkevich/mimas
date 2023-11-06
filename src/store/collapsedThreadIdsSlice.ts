import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const collapsedThreadIdsSlice = createSlice({
  name: "collapsed-thread-ids",
  initialState: [] as string[],
  reducers: {
    toggleThread(state, action: PayloadAction<string>) {
      const index = state.findIndex((id) => id == action.payload);
      if (index != -1) {
        state.splice(index, 1);
      } else {
        state.push(action.payload);
      }
    },
  },
});

export const { toggleThread } = collapsedThreadIdsSlice.actions;

export default collapsedThreadIdsSlice.reducer;
