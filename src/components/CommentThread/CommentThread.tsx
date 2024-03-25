import React, { memo } from "react";
import classNames from "classnames";
import { useComment } from "@services/api";
import { useAppDispatch, useAppSelector, useIsSmallScreen } from "@hooks";
import {
  toggleReplyToCommentId,
  toggleThreadCollapse,
  unsetReplyToCommentId,
} from "@store/commentsSlice";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  commentId: string;
  depth: number;
};

export const CommentThread = memo(function CommentThread({
  commentId,
  depth,
}: CommentThreadProps) {
  const { data: comment } = useComment(commentId);
  const { childIds, id, moreChildren } = comment;

  const showReplyForm = useAppSelector(
    (state) => state.comments.replyToCommentId == id,
  );
  const collapsed = useAppSelector((state) =>
    state.comments.collapsedThreadIds.includes(id),
  );
  const dispatch = useAppDispatch();
  const isSmallScreen = useIsSmallScreen();
  const renderReplies = childIds.length > 0 || moreChildren || showReplyForm;
  const depthLimit = isSmallScreen ? 7 : 20;

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => dispatch(toggleThreadCollapse(id))}
      >
        <Comment
          collapsed={collapsed}
          comment={comment}
          onReplyButtonClick={() => dispatch(toggleReplyToCommentId(id))}
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
            showCommentForm={showReplyForm}
            onComment={() => dispatch(unsetReplyToCommentId(id))}
          />
        </div>
      )}
    </div>
  );
});
