import React from "react";

import { CommentSkeleton } from "../Comment/CommentSkeleton";
import { CommentWrapper } from "../CommentWrapper/CommentWrapper";
import { baseIndent } from "./CommentThreadList";
import "./CommentThreadList.scss";

type CommentThreadListSkeletonProps = {
  itemCount?: number;
};

export function CommentThreadListSkeleton({
  itemCount = 10,
}: CommentThreadListSkeletonProps) {
  return (
    <div className="comment-thread-list">
      {new Array(itemCount).fill(0).map((_, i) => (
        <div key={i} className="comment-thread-list__item">
          <CommentWrapper indent={baseIndent}>
            <CommentSkeleton />
          </CommentWrapper>
        </div>
      ))}
    </div>
  );
}
