import React from "react";
import { Post as PostProps } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  posts: PostProps[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <Post {...post} />
        </li>
      ))}
    </ol>
  );
}
