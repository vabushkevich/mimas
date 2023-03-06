import React from "react";
import { Link } from "react-router-dom";
import { compactNumber } from "@utils";
import type { BasePost } from "@types";
import { useAvatar } from "@services/api";
import classNames from "classnames";

import { Card, SubmissionHeader } from "@components";
import "./BasePost.scss";

type BasePostProps = BasePost & {
  children?: React.ReactNode;
};

export function BasePost({
  commentCount,
  dateCreated,
  dateEdited,
  locked,
  pinned,
  score,
  subreddit,
  subredditId,
  title,
  url,
  userId,
  userName,
  vote,
  children,
}: BasePostProps) {
  const avatar = useAvatar(subredditId || userId);
  return (
    <Card>
      <div className="post">
        <SubmissionHeader
          dateCreated={dateCreated}
          dateEdited={dateEdited}
          locked={locked}
          picture={avatar}
          pinned={pinned}
          subreddit={subreddit}
          userName={userName}
        />
        <h3 className="post__title">
          <Link to={url}>{title}</Link>
        </h3>
        <div className="post__body">{children}</div>
        <div className="post__footer">
          <Link
            className="post__comments-btn"
            to={url}
          >
            {compactNumber(commentCount)}
          </Link>
          <div
            className={classNames(
              "post__voting",
              vote && `post__voting--vote-${vote}`
            )}
          >
            <button className="post__down-btn"></button>
            <div className="post__score">{compactNumber(score)}</div>
            <button className="post__up-btn"></button>
          </div>
        </div>
      </div>
    </Card>
  );
}
