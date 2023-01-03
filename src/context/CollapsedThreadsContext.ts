import { createContext } from "react";

type CollapsedThreadsContextType = {
  collapsedThreadIds: string[];
  toggleThread: (commentId: string) => void;
};

export const CollapsedThreadsContext =
  createContext<CollapsedThreadsContextType>(null);
