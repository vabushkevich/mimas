import React, { useState } from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector, useMediaQuery } from "@hooks";
import { toggleThreadCollapse } from "@store/commentsSlice";
import type { Comment as CommentType } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  comment: CommentType;
  commentAuthorAvatar?: string | null;
  depth: number;
};

export function CommentThread({
  comment,
  commentAuthorAvatar,
  depth,
}: CommentThreadProps) {
  const { childIds, id, moreChildren } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const collapsed = useAppSelector((state) =>
    state.comments.collapsedThreadIds.includes(id),
  );
  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 576px)");
  const renderReplies = childIds.length > 0 || moreChildren || showReplyForm;
  const depthLimit = isSmallScreen ? 7 : 20;

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => dispatch(toggleThreadCollapse(id))}
      >
        <Comment
          avatar={commentAuthorAvatar}
          collapsed={collapsed}
          comment={comment}
          onReplyButtonClick={() => setShowReplyForm((v) => !v)}
        />
      </CommentWrapper>
      {renderReplies && (
        <div
          className={classNames(
            "comment-thread__replies",
            collapsed && "comment-thread__replies--collapsed",
            depth >= depthLimit && "comment-thread__replies--flat",
          )}
        >
          <CommentThreadList
            commentIds={childIds}
            depth={depth + 1}
            moreComments={moreChildren}
            parentId={id}
            showReplyForm={showReplyForm}
            onReply={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
