import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { Comment } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  collapsedThreadIds: string[];
  users: Record<string, User>;
  onCollapseToggle: (id: string) => void;
};

export function CommentThread({
  collapsedThreadIds,
  comment,
  replies,
  moreReplies,
  users,
  onCollapseToggle,
}: CommentThreadProps) {
  const collapsed = collapsedThreadIds.includes(comment.id);

  return (
    <div className="comment-thread">
      <div className="comment-thread__comment-wrapper">
        <button
          className="comment-thread__collapse-btn"
          onClick={() => onCollapseToggle(comment.id)}
        ></button>
        <div className="comment-thread__comment">
          <Comment
            {...comment}
            avatar={users[comment.userId]?.avatar}
            collapsed={collapsed}
          />
        </div>
      </div>
      {replies.length > 0 && !collapsed && (
        <ol className="comment-thread__replies">
          {replies.map((reply) => (
            <li className="comment-thread__reply" key={reply.comment.id}>
              <CommentThread
                {...reply}
                collapsedThreadIds={collapsedThreadIds}
                users={users}
                onCollapseToggle={onCollapseToggle}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
