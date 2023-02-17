import React from "react";

import { PostSkeleton } from "@components";
import "./PostList.scss";
import "./PostListSkeleton.scss";

export function PostListSkeleton() {
  return (
    <ol className="post-list">
      {new Array(4).fill(0).map((v, i) => {
        return (
          <li key={i} className="post-list__item">
            <PostSkeleton />
          </li>
        );
      })}
    </ol>
  );
}
