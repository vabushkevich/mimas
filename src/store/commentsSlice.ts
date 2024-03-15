import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type State = {
  collapsedThreadIds: string[];
  replyToCommentId: string | null;
};

const initialState: State = {
  collapsedThreadIds: [],
  replyToCommentId: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    toggleReplyToCommentId(state, action: PayloadAction<string>) {
      state.replyToCommentId =
        state.replyToCommentId == action.payload ? null : action.payload;
    },
    toggleThreadCollapse(state, action: PayloadAction<string>) {
      const { collapsedThreadIds } = state;
      const index = collapsedThreadIds.findIndex((id) => id == action.payload);
      if (index != -1) {
        collapsedThreadIds.splice(index, 1);
      } else {
        collapsedThreadIds.push(action.payload);
      }
    },
    unsetReplyToCommentId(state, action: PayloadAction<string>) {
      if (state.replyToCommentId == action.payload) {
        state.replyToCommentId = null;
      }
    },
  },
});

export const {
  toggleReplyToCommentId,
  toggleThreadCollapse,
  unsetReplyToCommentId,
} = commentsSlice.actions;

export default commentsSlice.reducer;
