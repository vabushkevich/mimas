import React from "react";
import { User, CommentThreadList } from "@types";

import { CommentThread, CommentWrapper } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = CommentThreadList & {
  users: Record<string, User>;
  onThreadLoadMore: (path: string[], threadIds: string[]) => void;
  onThreadToggle: (path: string[]) => void;
};

export function CommentThreadList({
  more,
  threads,
  users,
  onThreadLoadMore,
  onThreadToggle,
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
            users={users}
            onLoadMore={onThreadLoadMore}
            onToggle={onThreadToggle}
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
