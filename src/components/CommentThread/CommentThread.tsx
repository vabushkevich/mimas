import React, { memo } from "react";
import { useComment } from "@services/api";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  collapsed: boolean;
  commentAuthorAvatar?: string;
  commentId: string;
  onToggle: (commentId: string) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  commentAuthorAvatar,
  commentId,
  onToggle,
}: CommentThreadProps) {
  const { data: comment } = useComment(commentId);
  const { childIds, moreChildren } = comment;
  const showReplies = !collapsed && (childIds.length > 0 || moreChildren);

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
      {showReplies && (
        <div className="comment-thread__replies">
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
