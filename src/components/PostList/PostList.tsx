import React from "react";
import { Post as PostType, AuthorType, FeedType } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  feedType: FeedType;
  hidePins?: boolean;
  posts: PostType[];
  primaryAuthorType?: AuthorType;
};

export function PostList({
  feedType,
  hidePins = false,
  posts,
  primaryAuthorType,
}: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <Post
            pinned={!hidePins && post.pinnedIn.includes(feedType)}
            post={post}
            primaryAuthorType={primaryAuthorType}
          />
        </li>
      ))}
    </ol>
  );
}
