import {
  CollapsedThreadsActionTypes,
  TOGGLE_THREAD,
} from "./types";

export function toggleThread(id: string): CollapsedThreadsActionTypes {
  return {
    type: TOGGLE_THREAD,
    payload: id,
  };
}
