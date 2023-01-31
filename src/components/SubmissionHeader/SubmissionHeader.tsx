import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, formatDate } from "@utils";
import { SubmissionDistinction } from "@types";
import classNames from "classnames";

import defaultAvatar from "./assets/default-avatar.svg";
import "./SubmissionHeader.scss";

type SubmissionHeaderProps = {
  bySubmitter?: boolean;
  dateCreated: number;
  dateEdited?: number;
  distinction?: SubmissionDistinction;
  locked?: boolean;
  picture: string;
  pinned?: boolean;
  subreddit?: string;
  userName: string;
};

export function SubmissionHeader({
  bySubmitter,
  dateCreated,
  dateEdited,
  distinction,
  locked,
  picture = defaultAvatar,
  pinned,
  subreddit,
  userName,
}: SubmissionHeaderProps) {
  const primaryAuthor = subreddit || userName;
  const hasStatusIcons = !!dateEdited || pinned || locked;

  return (
    <div className="submission-header">
      <Link
        className="submission-header__primary-author"
        to={`/${subreddit ? "r" : "user"}/${primaryAuthor}/`}
      >
        <div
          className="submission-header__picture"
          style={{ backgroundImage: `url("${picture}")` }}
        ></div>
        <div
          className={classNames(
            "submission-header__primary-author-name",
            bySubmitter && "submission-header__primary-author-name--submitter",
            distinction && `submission-header__primary-author-name--${distinction}`,
          )}
        >
          {primaryAuthor}
        </div>
      </Link>
      {subreddit && <Link to={`/user/${userName}/`}>{userName}</Link>}
      <div
        className="submission-header__date"
        title={formatDate(dateCreated)}
      >
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
