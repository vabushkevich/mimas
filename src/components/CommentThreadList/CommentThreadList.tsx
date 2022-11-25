import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { CommentThread, CommentWrapper } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  collapsedThreadIds: string[];
  moreReplies: string[];
  moreRepliesCount: number;
  threads: CommentThreadType[];
  users: Record<string, User>;
  onThreadCollapseToggle: (id: string) => void;
  onThreadLoadMore: (path: string[], threadIds: string[]) => void;
};

export function CommentThreadList({
  collapsedThreadIds,
  moreReplies,
  moreRepliesCount,
  threads,
  users,
  onThreadCollapseToggle,
  onThreadLoadMore,
}: CommentThreadListProps) {
  return (
    <ol className="comment-thread-list">
      {threads.map((thread) => (
        <li key={thread.comment.id} className="comment-thread-list__item">
          <CommentThread
            {...thread}
            collapsedThreadIds={collapsedThreadIds}
            users={users}
            onCollapseToggle={onThreadCollapseToggle}
            onLoadMore={onThreadLoadMore}
          />
        </li>
      ))}
      {moreRepliesCount > 0 && (
        <li className="comment-thread-list__item">
          <CommentWrapper
            onCollapseButtonClick={() => onThreadLoadMore([], moreReplies)}
          >
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => onThreadLoadMore([], moreReplies)}
            >
              {moreRepliesCount} more replies
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
