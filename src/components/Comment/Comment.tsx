import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { Comment } from "@types";

import { UserContent } from "@components";
import "./Comment.scss";

type CommentProps = Comment & {
  collapsed?: boolean;
};

export function Comment({
  avatar,
  bodyHtml,
  collapsed = false,
  dateCreated,
  score,
  userName,
}: CommentProps) {
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
          <div className="comment__user-name">{userName}</div>
        </a>
        <div
          className="comment__date"
          title={formatDate(dateCreated)}
        >
          {formatDistanceToNow(dateCreated)}
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="comment__body">
            <UserContent html={bodyHtml} />
          </div>
          <div className="comment__footer">
            <button className="comment__reply-btn">Reply</button>
            <div className="comment__voting">
              <button className="comment__down-btn"></button>
              <div className="comment__score">{compactNumber(score)}</div>
              <button className="comment__up-btn"></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
