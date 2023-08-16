import React from "react";

import { PostSkeleton } from "@components";
import "./PostList.scss";
import "./PostListSkeleton.scss";

type PostListSkeletonProps = {
  count?: number;
};

export function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <ol className="post-list">
      {new Array(count).fill(0).map((v, i) => {
        return (
          <li key={i} className="post-list__item">
            <PostSkeleton />
          </li>
        );
      })}
    </ol>
  );
}
