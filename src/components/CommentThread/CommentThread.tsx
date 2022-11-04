import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { Comment } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  users: Record<string, User>;
};

export function CommentThread({
  comment,
  replies,
  moreReplies,
  users,
}: CommentThreadProps) {
  return (
    <div className="comment-thread">
      <Comment {...comment} avatar={users[comment.userId]?.avatar} />
      {replies.length > 0 && (
        <ol className="comment-thread__replies">
          {replies.map((reply) => (
            <li className="comment-thread__reply" key={reply.comment.id}>
              <CommentThread {...reply} users={users} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
