import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, formatDate } from "@utils";
import { SubmissionDistinction, AuthorType } from "@types";
import classNames from "classnames";

import { Avatar, Flair } from "@components";
import PencilIcon from "./assets/pencil.svg";
import PinIcon from "./assets/pin.svg";
import LockIcon from "./assets/lock.svg";
import "./SubmissionHeader.scss";

type SubmissionHeaderProps = {
  avatar?: string | null;
  bySubmitter?: boolean;
  dateCreated: number;
  dateEdited?: number;
  distinction?: SubmissionDistinction;
  flair?: string;
  locked?: boolean;
  pinned?: boolean;
  primaryAuthorType?: AuthorType;
  subreddit?: string;
  url?: string;
  userName: string;
};

export function SubmissionHeader({
  avatar,
  bySubmitter,
  dateCreated,
  dateEdited,
  distinction,
  flair,
  locked,
  pinned,
  primaryAuthorType = "user",
  subreddit,
  url,
  userName,
}: SubmissionHeaderProps) {
  const subredditIsPrimaryAuthor =
    primaryAuthorType == "subreddit" && subreddit;
  const hasStatusIcons = !!dateEdited || pinned || locked;

  const date = (
    <div
      className={classNames(
        "submission-header__date",
        url && "submission-header__date--clickable",
      )}
      title={formatDate(dateCreated)}
    >
      {formatDistanceToNow(dateCreated)}
    </div>
  );

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
          to={`/user/${userName}`}
        >
          {userName}
        </Link>
      )}
      {url ? <Link to={url}>{date}</Link> : date}
      {hasStatusIcons && (
        <div className="submission-header__status-icons">
          {pinned && <PinIcon className="submission-header__icon" />}
          {locked && <LockIcon className="submission-header__icon" />}
          {dateEdited && (
            <div
              title={`${formatDate(dateEdited)} (${formatDistanceToNow(
                dateEdited,
              )} ago)`}
            >
              <PencilIcon className="submission-header__icon" />
            </div>
          )}
        </div>
      )}
      {flair && <Flair className="submission-header__flair" text={flair} />}
    </div>
  );
}
