import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    collapsedThreadIds: [] as string[],
  },
  reducers: {
    toggleThreadCollapse(state, action: PayloadAction<string>) {
      const { collapsedThreadIds } = state;
      const index = collapsedThreadIds.findIndex((id) => id == action.payload);
      if (index != -1) {
        collapsedThreadIds.splice(index, 1);
      } else {
        collapsedThreadIds.push(action.payload);
      }
    },
  },
});

export const { toggleThreadCollapse } = commentsSlice.actions;

export default commentsSlice.reducer;
