import React from "react";
import { CommentThread as CommentThreadType, User } from "@types";

import { Comment } from "@components";
import { CommentWrapper } from "./CommentWrapper";
import "./CommentThread.scss";

type CommentThreadProps = CommentThreadType & {
  collapsedThreadIds: string[];
  users: Record<string, User>;
  onCollapseToggle: (id: string) => void;
  onLoadMore: (path: string[], threadIds: string[]) => void;
};

export function CommentThread({
  collapsedThreadIds,
  comment,
  replies,
  moreReplies,
  moreRepliesCount,
  users,
  onCollapseToggle,
  onLoadMore,
}: CommentThreadProps) {
  const collapsed = collapsedThreadIds.includes(comment.id);

  return (
    <div className="comment-thread">
      <CommentWrapper
        onCollapseButtonClick={() => onCollapseToggle(comment.id)}
      >
        <Comment
          {...comment}
          avatar={users[comment.userId]?.avatar}
          collapsed={collapsed}
        />
      </CommentWrapper>
      {(!collapsed && (replies.length > 0 || moreReplies.length > 0)) && (
        <ol className="comment-thread__replies">
          {replies.map((reply) => (
            <li className="comment-thread__reply" key={reply.comment.id}>
              <CommentThread
                {...reply}
                collapsedThreadIds={collapsedThreadIds}
                users={users}
                onCollapseToggle={onCollapseToggle}
                onLoadMore={(path, threadIds) =>
                  onLoadMore([comment.id, ...path], threadIds)
                }
              />
            </li>
          ))}
          {moreReplies.length > 0 && (
            <li className="comment-thread__reply">
              <CommentWrapper
                onCollapseButtonClick={() =>
                  onLoadMore([comment.id], moreReplies)
                }
              >
                <button
                  className="comment-thread__more-replies-btn"
                  onClick={() => onLoadMore([comment.id], moreReplies)}
                >
                  {moreRepliesCount} more replies
                </button>
              </CommentWrapper>
            </li>
          )}
        </ol>
      )}
    </div>
  );
}
