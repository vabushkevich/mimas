import React from "react";
import { User, CommentThreadList } from "@types";

import { CommentThread, CommentWrapper } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = CommentThreadList & {
  collapsedThreadIds: string[];
  users: Record<string, User>;
  onThreadCollapseToggle: (id: string) => void;
  onThreadLoadMore: (path: string[], threadIds: string[]) => void;
};

export function CommentThreadList({
  collapsedThreadIds,
  more,
  threads,
  users,
  onThreadCollapseToggle,
  onThreadLoadMore,
}: CommentThreadListProps) {
  const moreRepliesMessage = (() => {
    if (!more) return;
    switch (more.totalCount) {
      case 0: return "More comments";
      case 1: return "1 comment";
      default: return `${more.totalCount} comments`;
    }
  })();

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
      {more && (
        <li className="comment-thread-list__item">
          <CommentWrapper
            onCollapseButtonClick={() => onThreadLoadMore([], more.ids)}
          >
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => onThreadLoadMore([], more.ids)}
            >
              {moreRepliesMessage}
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
