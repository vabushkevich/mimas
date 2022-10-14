import React from "react";
import { Post } from "@types";

import "./BasePost.scss";

export function BasePost({
  commentCount,
  dateCreated,
  score,
  subreddit,
  title,
  url,
  userName,
  children,
}: Post & { children?: React.ReactNode }) {
  return (
    <div className="post-preview">
      <div className="post-preview__header">
        <a href={`https://www.reddit.com/r/${subreddit}/`}>
          <div className="post-preview__subreddit">{subreddit}</div>
        </a>
        <a
          className="post-preview__user"
          href={`https://www.reddit.com/user/${userName}/`}
        >
          {userName}
        </a>
        <div className="post-preview__date">{new Date(dateCreated).toLocaleString()}</div>
      </div>
      <a
        className="post-preview__title"
        href={url}
      >
        {title}
      </a>
      <div>{children}</div>
      <div className="post-preview__footer">
        <a
          className="post-preview__comments-btn"
          href={url}
        >
          {commentCount}
        </a>
        <div className="post-preview__voting">
          <button className="post-preview__down-btn"></button>
          <div className="post-preview__score">{score}</div>
          <button className="post-preview__up-btn"></button>
        </div>
      </div>
    </div>
  );
}
