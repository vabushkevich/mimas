import { createContext } from "react";
import { Comment } from "@types";

type CommentsContextType = {
  comments: Record<string, Comment>;
  loadMoreComments: (commentId: string) => void;
};

export const CommentsContext = createContext<CommentsContextType>(null);
