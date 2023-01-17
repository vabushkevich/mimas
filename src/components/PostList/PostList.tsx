import React from "react";
import { Post as PostType } from "@types";

import { Post } from "@components";
import "./PostList.scss";

type PostListProps = {
  posts: PostType[];
  removeSubreddit?: boolean;
  unmarkPinned?: boolean;
};

export function PostList({
  posts,
  removeSubreddit = false,
  unmarkPinned = false,
}: PostListProps) {
  return (
    <ol className="post-list">
      {posts.map((post) => {
        const { id, pinned, subreddit } = post;
        return (
          <li key={id} className="post-list__item">
            <Post
              {...post}
              pinned={pinned && !unmarkPinned}
              subreddit={removeSubreddit ? undefined : subreddit}
            />
          </li>
        );
      })}
    </ol>
  );
}
