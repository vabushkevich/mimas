import React from "react";
import { Post as PostType } from "@types";
import { useAvatars } from "@hooks";

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
  const postAuthorType = removeSubreddit ? "user" : "subreddit";
  const avatars = useAvatars(posts, postAuthorType);

  return (
    <ol className="post-list">
      {posts.map((post) => {
        const { id, pinned, subreddit, userId, subredditId } = post;
        const avatar = avatars[removeSubreddit ? userId : subredditId];
        return (
          <li key={id} className="post-list__item">
            <Post
              {...post}
              avatar={avatar}
              pinned={pinned && !unmarkPinned}
              subreddit={removeSubreddit ? undefined : subreddit}
            />
          </li>
        );
      })}
    </ol>
  );
}
