import React, { memo } from "react";
import { useComment, useAvatar } from "@services/api";
import classNames from "classnames";
import { useTypedSelector } from "@hooks";
import { useDispatch } from "react-redux";
import { toggleThread } from "@store/collapsed-threads/actions";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  commentId: string;
};

export const CommentThread = memo(function CommentThread({
  commentId,
}: CommentThreadProps) {
  const { data: comment } = useComment(commentId);
  const { childIds, moreChildren } = comment;
  const renderReplies = childIds.length > 0 || moreChildren;
  const commentAuthorAvatar = useAvatar(comment.userId);
  const collapsed = useTypedSelector((state) => state.ids.includes(commentId));
  const dispatch = useDispatch();

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => dispatch(toggleThread(commentId))}
      >
        <Comment
          {...comment}
          avatar={commentAuthorAvatar}
          collapsed={collapsed}
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
            moreComments={moreChildren}
            parentId={commentId}
          />
        </div>
      )}
    </div>
  );
});
