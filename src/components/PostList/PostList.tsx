import React from "react";
import { Post } from "@types";

import { PostPreview } from "@components";
import "./PostList.scss";

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <PostPreview {...post} />
        </li>
      ))}
    </ol>
  );
}
