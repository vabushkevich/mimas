import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { Comment } from "@types";
import classNames from "classnames";

import { UserContent } from "@components";
import "./Comment.scss";

type CommentProps = Comment & {
  collapsed?: boolean;
};

export function Comment({
  avatar,
  bodyHtml,
  byAdmin,
  byModerator,
  bySubmitter,
  collapsed = false,
  dateCreated,
  dateEdited,
  locked,
  pinned,
  score,
  scoreHidden,
  userName,
}: CommentProps) {
  const hasStatusIcons = !!dateEdited || pinned || locked;

  return (
    <div className="comment">
      <div className="comment__header">
        <a
          className="comment__user"
          href={`https://www.reddit.com/user/${userName}/`}
        >
          <div
            className="comment__user-img"
            style={{ backgroundImage: `url("${avatar}")` }}
          ></div>
          <div
            className={classNames(
              "comment__user-name",
              bySubmitter && "comment__user-name--submitter",
              byModerator && "comment__user-name--moderator",
              byAdmin && "comment__user-name--admin",
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
            {!!dateEdited && (
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
