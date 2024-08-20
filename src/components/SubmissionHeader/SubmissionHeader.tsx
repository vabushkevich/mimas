import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, formatDate } from "@utils";
import { SubmissionDistinction, AuthorType } from "@types";
import classNames from "classnames";

import { Flair } from "@components";
import { AuthorLink } from "./AuthorLink";
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
      <AuthorLink
        avatar={avatar}
        bySubmitter={bySubmitter}
        className="submission-header__author"
        distinction={distinction}
        isPrimary
        name={subredditIsPrimaryAuthor ? subreddit : userName}
        type={primaryAuthorType}
      />
      {subredditIsPrimaryAuthor && (
        <AuthorLink
          className="submission-header__author"
          name={userName}
          type="user"
        />
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
