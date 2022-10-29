import React from "react";
import { Comment as CommentProps } from "@types";

import "./Comment.scss";

export function Comment({
  avatar,
  contentHtml,
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
        <div className="comment__date">{new Date(dateCreated).toLocaleString()}</div>
      </div>
      <div
        className="comment__body"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      ></div>
      <div className="comment__footer">
        <button className="comment__reply-btn">Reply</button>
        <div className="comment__voting">
          <button className="comment__down-btn"></button>
          <div className="comment__score">{score}</div>
          <button className="comment__up-btn"></button>
        </div>
      </div>
    </div>
  );
}