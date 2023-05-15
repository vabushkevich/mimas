import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, formatDate } from "@utils";
import { SubmissionDistinction, AuthorType } from "@types";
import classNames from "classnames";

import { Avatar } from "@components";
import "./SubmissionHeader.scss";

type SubmissionHeaderProps = {
  bySubmitter?: boolean;
  dateCreated: number;
  dateEdited?: number;
  distinction?: SubmissionDistinction;
  locked?: boolean;
  picture?: string;
  pinned?: boolean;
  primaryAuthorType?: AuthorType;
  subreddit?: string;
  userName: string;
};

export function SubmissionHeader({
  bySubmitter,
  dateCreated,
  dateEdited,
  distinction,
  locked,
  picture,
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
        <div className="primary-author__picture">
          <Avatar picture={picture} size="xs" />
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
              title={formatDate(dateEdited)}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}
