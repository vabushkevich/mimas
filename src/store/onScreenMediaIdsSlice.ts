import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const onScreenMediaIdsSlice = createSlice({
  name: "onScreenMediaIds",
  initialState: [] as string[],
  reducers: {
    addOnScreenMediaId(state, action: PayloadAction<string>) {
      state.push(action.payload);
    },
    removeOnScreenMediaId(state, action: PayloadAction<string>) {
      const index = state.findIndex((id) => id == action.payload);
      if (index != -1) state.splice(index, 1);
    },
  },
});

export const { addOnScreenMediaId, removeOnScreenMediaId } =
  onScreenMediaIdsSlice.actions;

export default onScreenMediaIdsSlice.reducer;
