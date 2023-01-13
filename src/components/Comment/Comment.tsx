import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import type { Comment } from "@types";
import classNames from "classnames";
import { capitalize } from "lodash-es";

import { UserContent } from "@components";
import defaultAvatar from "./assets/default-avatar.svg";
import "./Comment.scss";

type CommentProps = Comment & {
  collapsed?: boolean;
};

export function Comment({
  avatar = defaultAvatar,
  bodyHtml,
  bySubmitter,
  collapsed = false,
  dateCreated,
  dateEdited,
  deletedBy,
  distinction,
  locked,
  pinned,
  score,
  scoreHidden,
  userName,
}: CommentProps) {
  const hasStatusIcons = !!dateEdited || pinned || locked;

  if (deletedBy) return (
    <div className="comment comment--deleted">
      {capitalize(deletedBy)} removed comment
    </div>
  );

  return (
    <div className="comment">
      <div className="comment__header">
        <a
          className="comment__user"
          href={`/user/${userName}/`}
        >
          <div
            className="comment__user-img"
            style={{ backgroundImage: `url("${avatar}")` }}
          ></div>
          <div
            className={classNames(
              "comment__user-name",
              bySubmitter && "comment__user-name--submitter",
              distinction && `comment__user-name--${distinction}`,
            )}
          >
            {userName}
          </div>
        </a>
        <div
          className="comment__date"
          title={formatDate(dateCreated)}
        >
          {formatDistanceToNow(dateCreated)}
        </div>
        {hasStatusIcons && (
          <div className="comment__status-icons">
            {dateEdited && (
              <div
                className="comment__pencil-icon"
                title={formatDate(dateEdited)}
              ></div>
            )}
            {pinned && <div className="comment__pin-icon"></div>}
            {locked && <div className="comment__lock-icon"></div>}
          </div>
        )}
      </div>
      {!collapsed && (
        <>
          <div className="comment__body">
            <UserContent html={bodyHtml} />
          </div>
          <div className="comment__footer">
            {!locked && <button className="comment__reply-btn">Reply</button>}
            <div className="comment__voting">
              <button className="comment__down-btn"></button>
              <div className="comment__score">
                {scoreHidden ? "–" : compactNumber(score)}
              </div>
              <button className="comment__up-btn"></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
