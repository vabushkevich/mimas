import React, { memo, useCallback } from "react";
import { CommentThread as CommentThreadType } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  onLoadMore: (commentIds: string[], path: string[]) => void;
  onToggle: (path: string[]) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  comment,
  replies,
  onLoadMore,
  onToggle,
}: CommentThreadProps) {
  const showReplies = !collapsed && (
    replies.threads.length > 0 || replies.more
  );

  const handleThreadLoadMore = useCallback(
    (commentIds: string[], path: string[]) =>
      onLoadMore(commentIds, [comment.id, ...path]),
    [comment.id],
  );

  const handleThreadToggle = useCallback(
    (path: string[]) => onToggle([comment.id, ...path]),
    [comment.id],
  );

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onToggle([comment.id])}
      >
        <Comment
          {...comment}
          collapsed={collapsed}
        />
      </CommentWrapper>
      {showReplies && (
        <div className="comment-thread__replies">
          <CommentThreadList
            {...replies}
            onThreadLoadMore={handleThreadLoadMore}
            onThreadToggle={handleThreadToggle}
          />
        </div>
      )}
    </div>
  );
});
