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
      <div className="post">
        <div className="post__header">
          <a
            className="post__subreddit"
            href={`https://www.reddit.com/r/${subreddit}/`}
          >
            <div
              className="post__subreddit-img"
              style={{ backgroundImage: `url("${avatar}")` }}
            ></div>
            <div className="post__subreddit-name">{subreddit}</div>
          </a>
          <a
            className="post__user"
            href={`https://www.reddit.com/user/${userName}/`}
          >
            {userName}
          </a>
          <div
            className="post__date"
            title={formatDate(dateCreated)}
          >
            {formatDistanceToNow(dateCreated)}
          </div>
        </div>
        <a
          className="post__title"
          href={url}
        >
          {title}
        </a>
        <div className="post__body">{children}</div>
        <div className="post__footer">
          <a
            className="post__comments-btn"
            href={url}
          >
            {compactNumber(commentCount)}
          </a>
          <div className="post__voting">
            <button className="post__down-btn"></button>
            <div className="post__score">{compactNumber(score)}</div>
            <button className="post__up-btn"></button>
          </div>
        </div>
      </div>
    </Card>
  );
}
