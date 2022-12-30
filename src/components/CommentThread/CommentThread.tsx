import React, { memo, useCallback } from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  users: Record<string, User>;
  onLoadMore: (path: string[], threadIds: string[]) => void;
  onToggle: (path: string[]) => void;
};

export const CommentThread = memo(function CommentThread({
  collapsed,
  comment,
  replies,
  users,
  onLoadMore,
  onToggle,
}: CommentThreadProps) {
  const showReplies = !collapsed && (
    replies.threads.length > 0 || replies.more
  );

  const handleThreadLoadMore = useCallback(
    (path: string[], threadIds: string[]) =>
      onLoadMore([comment.id, ...path], threadIds),
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
          avatar={users[comment.userId]?.avatar}
          collapsed={collapsed}
        />
      </CommentWrapper>
      {showReplies && (
        <div className="comment-thread__replies">
          <CommentThreadList
            {...replies}
            users={users}
            onThreadLoadMore={handleThreadLoadMore}
            onThreadToggle={handleThreadToggle}
          />
        </div>
      )}
    </div>
  );
});
