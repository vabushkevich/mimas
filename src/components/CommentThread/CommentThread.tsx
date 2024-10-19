import React, { memo } from "react";
import classNames from "classnames";
import { useComment } from "@services/api";
import { useAppDispatch, useAppSelector } from "@hooks";
import {
  toggleReplyToCommentId,
  toggleThreadCollapse,
  unsetReplyToCommentId,
} from "@store/commentsSlice";

import { Comment } from "../Comment/Comment";
import { CommentThreadList } from "../CommentThreadList/CommentThreadList";
import { CommentWrapper } from "../CommentWrapper/CommentWrapper";
import "./CommentThread.scss";

type CommentThreadProps = {
  commentId: string;
  depth: number;
  indent: number;
};

export const CommentThread = memo(function CommentThread({
  commentId,
  depth,
  indent,
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
  const renderReplies = childIds.length > 0 || moreChildren || showReplyForm;

  return (
    <div className="comment-thread">
      <CommentWrapper
        indent={indent}
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
          )}
        >
          <CommentThreadList
            commentIds={childIds}
            depth={depth + 1}
            moreComments={moreChildren}
            parentId={id}
            showCommentForm={showReplyForm}
            onComment={() => dispatch(unsetReplyToCommentId(id))}
            onCommentFormClose={() => dispatch(unsetReplyToCommentId(id))}
          />
        </div>
      )}
    </div>
  );
});
