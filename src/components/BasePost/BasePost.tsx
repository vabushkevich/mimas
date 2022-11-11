import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { BasePost as BasePostType } from "@types";

import { Card } from "@components";
import "./BasePost.scss";

type BasePostProps = BasePostType & {
  children?: React.ReactNode;
};

export function BasePost({
  avatar,
  commentCount,
  dateCreated,
  score,
  subreddit,
  title,
  url,
  userName,
  children,
}: BasePostProps) {
  return (
    <Card>
      <div className="post-preview">
        <div className="post-preview__header">
          <a
            className="post-preview__subreddit"
            href={`https://www.reddit.com/r/${subreddit}/`}
          >
            <div
              className="post-preview__subreddit-img"
              style={{ backgroundImage: `url("${avatar}")` }}
            ></div>
            <div className="post-preview__subreddit-name">{subreddit}</div>
          </a>
          <a
            className="post-preview__user"
            href={`https://www.reddit.com/user/${userName}/`}
          >
            {userName}
          </a>
          <div
            className="post-preview__date"
            title={formatDate(dateCreated)}
          >
            {formatDistanceToNow(dateCreated)}
          </div>
        </div>
        <a
          className="post-preview__title"
          href={url}
        >
          {title}
        </a>
        {React.Children.count(children) > 0 && (
          <div className="post-preview__body">{children}</div>
        )}
        <div className="post-preview__footer">
          <a
            className="post-preview__comments-btn"
            href={url}
          >
            {compactNumber(commentCount)}
          </a>
          <div className="post-preview__voting">
            <button className="post-preview__down-btn"></button>
            <div className="post-preview__score">{compactNumber(score)}</div>
            <button className="post-preview__up-btn"></button>
          </div>
        </div>
      </div>
    </Card>
  );
}
