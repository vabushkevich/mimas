import React, { memo } from "react";
import { Comment as CommentType } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  collapsed: boolean;
  comment: CommentType;
  commentAuthorAvatar?: string;
  onToggle: (commentId: string) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  comment,
  commentAuthorAvatar,
  onToggle,
}: CommentThreadProps) {
  const { childIds, id, moreChildren } = comment;
  const showReplies = !collapsed && (childIds.length > 0 || moreChildren);

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onToggle(id)}
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
            parentId={id}
          />
        </div>
      )}
    </div>
  );
});
