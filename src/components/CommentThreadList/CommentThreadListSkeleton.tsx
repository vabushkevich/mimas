import React from "react";

import { CommentSkeleton, CommentWrapper } from "@components";
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
      <ol className="comment-thread-list__list">
        {new Array(itemCount).fill(0).map((_, i) => (
          <li key={i} className="comment-thread-list__item">
            <CommentWrapper indent={baseIndent}>
              <CommentSkeleton />
            </CommentWrapper>
          </li>
        ))}
      </ol>
    </div>
  );
}
