import React from "react";
import type { Comment } from "@types";
import { capitalize } from "lodash-es";
import { useAvatar, useVote } from "@services/api";
import { useAuthGuard } from "@hooks";

import { UserContent, SubmissionHeader, Voting } from "@components";
import "./Comment.scss";

type CommentProps = {
  collapsed?: boolean;
  comment: Comment;
  hideDistinction?: boolean;
  hideLock?: boolean;
  hidePin?: boolean;
  hideReplyButton?: boolean;
  onReplyButtonClick?: () => void;
};

export function Comment({
  collapsed = false,
  comment,
  hideDistinction,
  hideLock,
  hidePin,
  hideReplyButton,
  onReplyButtonClick,
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
    userId,
    userName,
    voteDirection,
  } = comment;

  const avatar = useAvatar(userId);
  const vote = useAuthGuard(useVote(comment).mutate);

  if (deletedBy) {
    return (
      <div className="comment comment--deleted">
        {capitalize(deletedBy)} removed comment
      </div>
    );
  }

  return (
    <div className="comment">
      <SubmissionHeader
        avatar={avatar}
        bySubmitter={!hideDistinction ? bySubmitter : undefined}
        dateCreated={dateCreated}
        dateEdited={dateEdited}
        distinction={!hideDistinction ? distinction : undefined}
        locked={!hideLock && locked}
        pinned={!hidePin && pinned}
        userName={userName}
      />
      {!collapsed && (
        <>
          <div className="comment__body">
            <UserContent html={bodyHtml} />
          </div>
          <div className="comment__footer">
            {!hideReplyButton && (
              <button
                className="comment__reply-btn"
                disabled={locked}
                onClick={onReplyButtonClick}
              >
                Reply
              </button>
            )}
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
