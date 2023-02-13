import React, { useContext } from "react";
import { MoreItems } from "@types";
import {
  CollapsedThreadsContext,
} from "@context";
import { useLoadMoreComments } from "@services/api";

import { CommentThread, CommentWrapper } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  commentIds: string[];
  moreComments?: MoreItems;
  parentId?: string;
};

export function CommentThreadList({
  commentIds,
  moreComments,
  parentId,
}: CommentThreadListProps) {
  const {
    mutate: loadMoreComments,
  } = useLoadMoreComments({ commentId: parentId });
  const {
    collapsedThreadIds,
    toggleThread,
  } = useContext(CollapsedThreadsContext);
  const moreCommentsMessage = (() => {
    if (!moreComments) return;
    switch (moreComments.totalCount) {
      case 0: return "More comments";
      case 1: return "1 comment";
      default: return `${moreComments.totalCount} comments`;
    }
  })();

  return (
    <ol className="comment-thread-list">
      {commentIds.map((commentId) => {
        const collapsed = collapsedThreadIds.includes(commentId);
        return (
          <li key={commentId} className="comment-thread-list__item">
            <CommentThread
              collapsed={collapsed}
              commentId={commentId}
              onToggle={toggleThread}
            />
          </li>
        );
      })}
      {moreComments && (
        <li className="comment-thread-list__item">
          <CommentWrapper
            onCollapseButtonClick={() => loadMoreComments()}
          >
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => loadMoreComments()}
            >
              {moreCommentsMessage}
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
