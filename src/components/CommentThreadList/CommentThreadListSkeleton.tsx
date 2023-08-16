import React from "react";

import { CommentWrapper, CommentSkeleton } from "@components";
import "./CommentThreadList.scss";
import "./CommentThreadListSkeleton.scss";

type CommentThreadListSkeletonProps = {
  count?: number;
};

export function CommentThreadListSkeleton({
  count = 3,
}: CommentThreadListSkeletonProps) {
  return (
    <ol className="comment-thread-list">
      {new Array(count).fill(0).map((v, i) => (
        <li key={i} className="comment-thread-list__item">
          <CommentWrapper>
            <CommentSkeleton />
          </CommentWrapper>
        </li>
      ))}
    </ol>
  );
}
