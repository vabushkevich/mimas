import React from "react";
import { CommentThread, User } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThread & {
  users: Record<string, User>;
  onLoadMore: (path: string[], threadIds: string[]) => void;
  onToggle: (path: string[]) => void;
};

export function CommentThread({
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
            onThreadLoadMore={(path, threadIds) =>
              onLoadMore([comment.id, ...path], threadIds)
            }
            onThreadToggle={(path) => onToggle([comment.id, ...path])}
          />
        </div>
      )}
    </div>
  );
}
