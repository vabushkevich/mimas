import React from "react";
import type { Comment } from "@types";
import { capitalize } from "lodash-es";
import { useVote } from "@services/api";

import { UserContent, SubmissionHeader, Voting } from "@components";
import "./Comment.scss";

type CommentProps = {
  avatar?: string;
  collapsed?: boolean;
  comment: Comment;
};

export function Comment({
  avatar,
  collapsed = false,
  comment,
}: CommentProps) {
  const {
    bodyHtml,
    bySubmitter,
    dateCreated,
    dateEdited,
    deletedBy,
    distinction,
    locked,
    pinned,
    score,
    scoreHidden,
    userName,
    voteDirection,
  } = comment;
  const { mutate: vote } = useVote(comment);

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
              <Voting
                score={score}
                scoreHidden={scoreHidden}
                voteDirection={voteDirection}
                onVote={(direction) => vote({ direction })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
