import React from "react";
import { Post as PostType, AuthorType } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  posts: PostType[];
  primaryAuthorType?: AuthorType;
  unmarkPinned?: boolean;
};

export function PostList({
  posts,
  primaryAuthorType,
  unmarkPinned = false,
}: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <Post
            hidePin={unmarkPinned}
            post={post}
            primaryAuthorType={primaryAuthorType}
          />
        </li>
      ))}
    </ol>
  );
}
