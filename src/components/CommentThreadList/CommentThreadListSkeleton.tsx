import React from "react";

import { CommentSkeleton, CommentWrapper } from "@components";
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
            <CommentWrapper>
              <CommentSkeleton />
            </CommentWrapper>
          </li>
        ))}
      </ol>
    </div>
  );
}
