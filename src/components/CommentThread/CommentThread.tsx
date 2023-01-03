import React, { memo } from "react";
import { Comment as CommentType, User } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  collapsed: boolean;
  comment: CommentType;
  commentAuthor?: User;
  onToggle: (commentId: string) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  comment,
  commentAuthor,
  onToggle,
}: CommentThreadProps) {
  const { childIds, id, moreChildren } = comment;
  const avatar = commentAuthor?.avatar;
  const showReplies = !collapsed && (childIds.length > 0 || moreChildren);

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onToggle(id)}
      >
        <Comment
          {...comment}
          avatar={avatar}
          collapsed={collapsed}
        />
      </CommentWrapper>
      {showReplies && (
        <div className="comment-thread__replies">
          <CommentThreadList
            commentIds={childIds}
            moreComments={moreChildren}
            parentId={id}
          />
        </div>
      )}
    </div>
  );
});
