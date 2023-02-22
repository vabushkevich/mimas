import {
  CollapsedThreadsState,
  CollapsedThreadsActionTypes,
  TOGGLE_THREAD,
} from "./types";

const initialState: CollapsedThreadsState = {
  ids: [],
};

export function collapsedThreadsReducer(
  state = initialState,
  action: CollapsedThreadsActionTypes,
): CollapsedThreadsState {
  switch (action.type) {
    case TOGGLE_THREAD:
      return {
        ids: state.ids.includes(action.payload)
          ? state.ids.filter((id) => id != action.payload)
          : [...state.ids, action.payload]
      };
    default:
      return state;
  }
}
