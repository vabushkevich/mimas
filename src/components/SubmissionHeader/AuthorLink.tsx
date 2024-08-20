import React from "react";
import { Link } from "react-router-dom";
import { SubmissionDistinction, AuthorType } from "@types";
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
  type: AuthorType;
};

export function AuthorLink({
  avatar,
  bySubmitter,
  className: classNameProp,
  distinction,
  isPrimary,
  name,
  type,
}: AuthorLinkProps) {
  return (
    <Link
      className={classNames(
        classNameProp,
        "author-link",
        isPrimary && [
          "author-link--primary",
          bySubmitter && "author-link--submitter",
          distinction && `author-link--${distinction}`,
          (bySubmitter || distinction) && "author-link--highlighted",
        ],
      )}
      to={`${type == "user" ? "/user/" : "/r/"}${name}`}
    >
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
    </Link>
  );
}
