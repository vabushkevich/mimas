export const TOGGLE_THREAD = "TOGGLE_THREAD";

export interface CollapsedThreadsState {
  ids: string[];
}

interface toggleThreadAction {
  type: typeof TOGGLE_THREAD;
  payload: string;
}

export type CollapsedThreadsActionTypes = toggleThreadAction;
