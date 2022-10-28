import React from "react";
import { CommentThread as CommentThreadProps } from "@types";

import { Comment } from "@components";
import "./CommentThread.scss";

export function CommentThread({
  comment,
  replies,
  moreReplies,
}: CommentThreadProps) {
  return (
    <div className="comment-thread">
      <Comment {...comment} />
      {replies.length > 0 && (
        <ol className="comment-thread__replies">
          {replies.map((reply) => (
            <li className="comment-thread__reply" key={reply.comment.id}>
              <CommentThread {...reply} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
