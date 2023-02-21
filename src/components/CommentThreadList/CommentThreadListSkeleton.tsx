import React from "react";

import { CommentWrapper, CommentSkeleton } from "@components";
import "./CommentThreadList.scss";
import "./CommentThreadListSkeleton.scss";

export function CommentThreadListSkeleton() {
  return (
    <ol className="comment-thread-list">
      {new Array(4).fill(0).map((v, i) => (
        <li key={i} className="comment-thread-list__item">
          <CommentWrapper>
            <CommentSkeleton />
          </CommentWrapper>
        </li>
      ))}
    </ol>
  );
}
