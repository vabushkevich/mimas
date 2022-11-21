import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { CommentThread, Card } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  collapsedThreadIds: string[];
  threads: CommentThreadType[];
  users: Record<string, User>;
  onThreadCollapseToggle: (id: string) => void;
  onThreadLoadMore: (path: string[], threadIds: string[]) => void;
};

export function CommentThreadList({
  collapsedThreadIds,
  threads,
  users,
  onThreadCollapseToggle,
  onThreadLoadMore,
}: CommentThreadListProps) {
  return (
    <div className="comment-thread-list">
      <Card>
        <ol className="comment-thread-list__list">
          {threads.map((thread) => {
            return (
              <li key={thread.comment.id} className="comment-thread-list__item">
                <CommentThread
                  {...thread}
                  collapsedThreadIds={collapsedThreadIds}
                  users={users}
                  onCollapseToggle={(id) => onThreadCollapseToggle(id)}
                  onLoadMore={onThreadLoadMore}
                />
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
