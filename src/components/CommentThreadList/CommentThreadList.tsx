import React from "react";
import { User, CommentThreadList as CommentThreadListType } from "@types";

import { CommentThread, CommentWrapper } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = CommentThreadListType & {
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
      {more.ids.length > 0 && (
        <li className="comment-thread-list__item">
          <CommentWrapper
            onCollapseButtonClick={() => onThreadLoadMore([], more.ids)}
          >
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => onThreadLoadMore([], more.ids)}
            >
              {`${more.totalCount} comment${more.totalCount != 1 ? "s" : ""}`}
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
