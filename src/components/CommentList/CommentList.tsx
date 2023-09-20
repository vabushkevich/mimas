import React from "react";
import { Comment as CommentType } from "@types";

import { CommentListItem } from "./CommentListItem";
import { CommentListItemSkeleton } from "./CommentListItemSkeleton";
import "./CommentList.scss";

type CommentListProps = {
  comments: CommentType[];
  isLoading?: boolean;
};

export function CommentList({ comments, isLoading }: CommentListProps) {
  return (
    <ol className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-list__item">
          <CommentListItem comment={comment} />
        </li>
      ))}
      {isLoading &&
        new Array(comments.length > 0 ? 3 : 10).fill(0).map((_, i) => (
          <li key={i} className="comment-list__item">
            <CommentListItemSkeleton />
          </li>
        ))}
    </ol>
  );
}
