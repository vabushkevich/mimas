import React from "react";
import { Post as PostType, FeedType } from "@types";

import { Post, PostSkeleton } from "@components";
import "./PostList.scss";

type PostListProps = {
  feedType: FeedType;
  hideFlairs?: boolean;
  hidePins?: boolean;
  isLoading?: boolean;
  posts: PostType[];
  showSubreddits?: boolean;
};

export function PostList({
  feedType,
  hideFlairs = false,
  hidePins = false,
  isLoading = false,
  posts,
  showSubreddits,
}: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <Post
            hideFlair={hideFlairs}
            pinned={!hidePins && post.pinnedIn.includes(feedType)}
            post={post}
            showSubreddit={showSubreddits}
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
