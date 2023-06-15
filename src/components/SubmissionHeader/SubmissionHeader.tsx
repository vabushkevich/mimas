import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, formatDate } from "@utils";
import { SubmissionDistinction, AuthorType } from "@types";
import classNames from "classnames";

import { Avatar } from "@components";
import "./SubmissionHeader.scss";

type SubmissionHeaderProps = {
  avatar?: string | null;
  bySubmitter?: boolean;
  dateCreated: number;
  dateEdited?: number;
  distinction?: SubmissionDistinction;
  locked?: boolean;
  pinned?: boolean;
  primaryAuthorType?: AuthorType;
  subreddit?: string;
  userName: string;
};

export function SubmissionHeader({
  avatar,
  bySubmitter,
  dateCreated,
  dateEdited,
  distinction,
  locked,
  pinned,
  primaryAuthorType = "user",
  subreddit,
  userName,
}: SubmissionHeaderProps) {
  const subredditIsPrimaryAuthor =
    primaryAuthorType == "subreddit" && subreddit;
  const hasStatusIcons = !!dateEdited || pinned || locked;

  return (
    <div className="submission-header">
      <Link
        className={classNames([
          "primary-author",
          bySubmitter && "primary-author--submitter",
          distinction && `primary-author--${distinction}`,
          (bySubmitter || distinction) && "primary-author--highlighted",
        ])}
        to={subredditIsPrimaryAuthor ? `/r/${subreddit}` : `/user/${userName}`}
      >
        <div className="primary-author__avatar">
          <Avatar
            // Only subreddit can have `null` as `picture` value
            name={avatar === null ? subreddit : undefined}
            size="xs"
            src={avatar || undefined}
          />
        </div>
        <div className="primary-author__name">
          {subredditIsPrimaryAuthor ? subreddit : userName}
        </div>
      </Link>
      {subredditIsPrimaryAuthor && (
        <Link
          className="submission-header__secondary-author"
          to={`/user/${userName}/`}
        >
          {userName}
        </Link>
      )}
      <div className="submission-header__date" title={formatDate(dateCreated)}>
        {formatDistanceToNow(dateCreated)}
      </div>
      {hasStatusIcons && (
        <div className="submission-header__status-icons">
          {pinned && <div className="submission-header__pin-icon"></div>}
          {locked && <div className="submission-header__lock-icon"></div>}
          {dateEdited && (
            <div
              className="submission-header__pencil-icon"
              title={`${formatDate(dateEdited)} (${formatDistanceToNow(
                dateEdited,
              )} ago)`}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}
