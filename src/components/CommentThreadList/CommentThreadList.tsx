import React from "react";
import { CommentThread as CommentThreadType } from "@types";

import { CommentThread } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  threads: CommentThreadType[];
};

export function CommentThreadList({
  threads,
}: CommentThreadListProps) {
  return (
    <ol className="comment-thread-list">
      {threads.map((thread) => {
        return (
          <li key={thread.comment.id} className="comment-thread-list__item">
            <CommentThread {...thread} />
          </li>
        );
      })}
    </ol>
  );
}
