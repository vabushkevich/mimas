import React from "react";
import { compactNumber } from "@utils";
import type { Comment } from "@types";
import { capitalize } from "lodash-es";

import { UserContent, SubmissionHeader } from "@components";
import "./Comment.scss";

type CommentProps = Comment & {
  avatar?: string;
  collapsed?: boolean;
};

export function Comment({
  avatar,
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
  if (deletedBy) return (
    <div className="comment comment--deleted">
      {capitalize(deletedBy)} removed comment
    </div>
  );

  return (
    <div className="comment">
      <SubmissionHeader
        bySubmitter={bySubmitter}
        dateCreated={dateCreated}
        dateEdited={dateEdited}
        distinction={distinction}
        locked={locked}
        picture={avatar}
        pinned={pinned}
        userName={userName}
      />
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
