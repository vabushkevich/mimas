import React from "react";
import { Post } from "@types";

import "./PostPreview.scss";

export function PostPreview({
  commentCount,
  dateCreated,
  score,
  subreddit,
  title,
  userName,
}: Post) {
  return (
    <div className="post-preview">
      <div className="post-preview__header">
        <div className="post-preview__subreddit">{subreddit}</div>
        <div className="post-preview__user">{userName}</div>
        <div className="post-preview__date">{new Date(dateCreated).toLocaleString()}</div>
      </div>
      <div className="post-preview__title">{title}</div>
      <div className="post-preview__footer">
        <div className="post-preview__comments-btn">{commentCount}</div>
        <div className="post-preview__voting">
          <div className="post-preview__down-btn"></div>
          <div className="post-preview__score">{score}</div>
          <div className="post-preview__up-btn"></div>
        </div>
      </div>
    </div>
  );
}
