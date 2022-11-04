import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { CommentThread, Card } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  threads: CommentThreadType[];
  users: Record<string, User>;
};

export function CommentThreadList({
  threads,
  users,
}: CommentThreadListProps) {
  return (
    <div className="comment-thread-list">
      <Card>
        <ol className="comment-thread-list__list">
          {threads.map((thread) => {
            return (
              <li key={thread.comment.id} className="comment-thread-list__item">
                <CommentThread {...thread} users={users} />
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
