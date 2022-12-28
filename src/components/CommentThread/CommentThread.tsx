import React from "react";
import { CommentThread, User } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThread & {
  collapsedThreadIds: string[];
  users: Record<string, User>;
  onLoadMore: (path: string[], threadIds: string[]) => void;
  onToggle: (id: string) => void;
};

export function CommentThread({
  collapsedThreadIds,
  comment,
  replies,
  users,
  onLoadMore,
  onToggle,
}: CommentThreadProps) {
  const collapsed = collapsedThreadIds.includes(comment.id);
  const showReplies = !collapsed && (
    replies.threads.length > 0 || replies.more
  );

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onToggle(comment.id)}
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
            collapsedThreadIds={collapsedThreadIds}
            users={users}
            onThreadLoadMore={(path, threadIds) =>
              onLoadMore([comment.id, ...path], threadIds)
            }
            onThreadToggle={onToggle}
          />
        </div>
      )}
    </div>
  );
}
