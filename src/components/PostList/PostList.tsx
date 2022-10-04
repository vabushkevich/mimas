import React from "react";
import { Post } from "@types";

import { PostPreview } from "@components";

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <ol>
      {posts.map((post) => (
        <li key={post.id}>
          <PostPreview {...post} />
        </li>
      ))}
    </ol>
  );
}
