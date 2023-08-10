import React from "react";
import { Post as PostType, AuthorType, FeedType } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  feedType: FeedType;
  posts: PostType[];
  primaryAuthorType?: AuthorType;
  unmarkPinned?: boolean;
};

export function PostList({
  feedType,
  posts,
  primaryAuthorType,
  unmarkPinned = false,
}: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <Post
            pinned={!unmarkPinned && post.pinnedIn.includes(feedType)}
            post={post}
            primaryAuthorType={primaryAuthorType}
          />
        </li>
      ))}
    </ol>
  );
}
