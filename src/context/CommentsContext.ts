import { createContext } from "react";

type CommentsContextType = {
  loadMoreComments: (commentId: string) => void;
};

export const CommentsContext = createContext<CommentsContextType>(null);
