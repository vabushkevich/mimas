import React from "react";
import { Link } from "react-router-dom";
import { SubmissionDistinction } from "@types";
import classNames from "classnames";

import { Avatar } from "@components";
import "./AuthorLink.scss";

type AuthorLinkProps = {
  avatar?: string | null;
  bySubmitter?: boolean;
  className?: string;
  distinction?: SubmissionDistinction;
  isPrimary?: boolean;
  name: string;
  url: string;
};

export function AuthorLink({
  avatar,
  bySubmitter,
  className: classNameProp,
  distinction,
  isPrimary,
  name,
  url,
}: AuthorLinkProps) {
  const isHighlighted = !!(bySubmitter || distinction);
  const isDeleted = name == "[deleted]";

  const className = classNames(
    classNameProp,
    "author-link",
    isDeleted && "author-link--deleted",
    isPrimary && [
      "author-link--primary",
      bySubmitter && "author-link--submitter",
      distinction && `author-link--${distinction}`,
      isHighlighted && "author-link--highlighted",
    ],
  );

  const content = (
    <>
      {isPrimary && (
        <div className="author-link__avatar">
          <Avatar
            // Only subreddits can have `avatar === null`
            name={avatar === null ? name : undefined}
            size="xs"
            src={avatar || undefined}
          />
        </div>
      )}
      <div className="author-link__name">{name}</div>
    </>
  );

  if (isDeleted) return <div className={className}>{content}</div>;

  return (
    <Link className={className} to={url}>
      {content}
    </Link>
  );
}
