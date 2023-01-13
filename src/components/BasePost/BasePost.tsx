import React from "react";
import { compactNumber } from "@utils";
import type { BasePost } from "@types";

import { Card, SubmissionHeader } from "@components";
import "./BasePost.scss";

type BasePostProps = BasePost & {
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
        <SubmissionHeader
          dateCreated={dateCreated}
          picture={avatar}
          subreddit={subreddit}
          userName={userName}
        />
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
