import React from "react";
import { Link } from "react-router-dom";
import { compactNumber } from "@utils";
import type { BasePost, PostProps } from "@types";
import { useAvatar } from "@services/api";

import { Card, SubmissionHeader, Voting } from "@components";
import "./BasePost.scss";

type BasePostProps = PostProps<BasePost> & {
  children?: React.ReactNode;
};

export function BasePost({
  hidePin = false,
  post,
  primaryAuthorType = "subreddit",
  children,
}: BasePostProps) {
  const {
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
    voteDirection,
  } = post;
  const primaryAuthorId = primaryAuthorType == "subreddit"
    ? subredditId
    : userId;
  const avatar = useAvatar(primaryAuthorId);

  return (
    <Card>
      <div className="post">
        <SubmissionHeader
          dateCreated={dateCreated}
          dateEdited={dateEdited}
          locked={locked}
          picture={avatar}
          pinned={!hidePin && pinned}
          primaryAuthorType={primaryAuthorType}
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
          <div className="post__voting">
            <Voting score={score} voteDirection={voteDirection} />
          </div>
        </div>
      </div>
    </Card>
  );
}
