import React, { memo } from "react";
import { useComment, useAvatar } from "@services/api";
import classNames from "classnames";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  collapsed: boolean;
  commentId: string;
  onToggle: (commentId: string) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  commentId,
  onToggle,
}: CommentThreadProps) {
  const { data: comment } = useComment(commentId);
  const { childIds, moreChildren } = comment;
  const renderReplies = childIds.length > 0 || moreChildren;
  const commentAuthorAvatar = useAvatar(comment.userId);

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onToggle(commentId)}
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
