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
  moreReplies,
  moreRepliesCount,
  users,
  onCollapseToggle,
  onLoadMore,
}: CommentThreadProps) {
  const collapsed = collapsedThreadIds.includes(comment.id);

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
      {!collapsed && (replies.length > 0 || moreReplies.length > 0) && (
        <div className="comment-thread__replies">
          <CommentThreadList
            collapsedThreadIds={collapsedThreadIds}
            moreReplies={moreReplies}
            moreRepliesCount={moreRepliesCount}
            threads={replies}
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
