import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  collapsedThreadIds: string[];
  users: Record<string, User>;
  onCollapseToggle: (id: string) => void;
  onLoadMore: (path: string[], threadIds: string[]) => void;
};

export function CommentThread({
  collapsedThreadIds,
  comment,
  replies,
  users,
  onCollapseToggle,
  onLoadMore,
}: CommentThreadProps) {
  const collapsed = collapsedThreadIds.includes(comment.id);
  const showReplies = !collapsed && (
    replies.threads.length > 0 || replies.more.ids.length > 0
  );

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onCollapseToggle(comment.id)}
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
            onThreadCollapseToggle={onCollapseToggle}
            onThreadLoadMore={(path, threadIds) =>
              onLoadMore([comment.id, ...path], threadIds)
            }
          />
        </div>
      )}
    </div>
  );
}
