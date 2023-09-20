import React from "react";
import { Post as PostType, AuthorType, FeedType } from "@types";

import { Post, PostSkeleton } from "@components";
import "./PostList.scss";

type PostListProps = {
  feedType: FeedType;
  hidePins?: boolean;
  isLoading?: boolean;
  posts: PostType[];
  primaryAuthorType?: AuthorType;
};

export function PostList({
  feedType,
  hidePins = false,
  isLoading = false,
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
      {isLoading &&
        new Array(posts.length > 0 ? 3 : 10).fill(0).map((_, i) => (
          <li key={i} className="post-list__item">
            <PostSkeleton />
          </li>
        ))}
    </ol>
  );
}
