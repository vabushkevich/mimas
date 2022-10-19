import React from "react";
import { PostData } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  postsData: PostData[];
};

export function PostList({ postsData }: PostListProps) {
  return (
    <ol className="post-list">
      {postsData.map((postData) => (
        <li key={postData.name} className="post-list__item">
          <Post postData={postData} />
        </li>
      ))}
    </ol>
  );
}
