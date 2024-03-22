import React from "react";
import { MoreItems } from "@types";
import { useLoadMoreComments } from "@services/api";

import {
  CommentThreadContainer,
  CommentWrapper,
  Loader,
  CommentForm,
  CommentSkeleton,
} from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  commentIds: string[];
  depth?: number;
  hideLoadMoreButton?: boolean;
  isLoading?: boolean;
  moreComments?: MoreItems;
  parentId?: string;
  showReplyForm?: boolean;
  onReply?: () => void;
};

function getMoreCommentsMessage(moreComments: MoreItems) {
  const count = moreComments.totalCount;
  if (count > 1) return `${count} comments`;
  if (count == 1) return "1 comment";
  return "More comments";
}

export function CommentThreadList({
  commentIds,
  depth = 0,
  hideLoadMoreButton,
  isLoading,
  moreComments,
  parentId,
  showReplyForm = false,
  onReply,
}: CommentThreadListProps) {
  const { mutate: loadMoreComments, isLoading: isLoadingMore } =
    useLoadMoreComments({
      commentId: parentId,
    });

  return (
    <ol className="comment-thread-list">
      {showReplyForm && parentId && (
        <li className="comment-thread-list__item">
          <CommentWrapper collapseButtonDisabled>
            <CommentForm autoFocus parentId={parentId} onSubmit={onReply} />
          </CommentWrapper>
        </li>
      )}
      {commentIds.map((commentId) => {
        return (
          <li key={commentId} className="comment-thread-list__item">
            <CommentThreadContainer commentId={commentId} depth={depth} />
          </li>
        );
      })}
      {isLoading &&
        new Array(commentIds.length > 0 ? 3 : 10).fill(0).map((_, i) => (
          <li key={i} className="comment-thread-list__item">
            <CommentWrapper>
              <CommentSkeleton />
            </CommentWrapper>
          </li>
        ))}
      {!hideLoadMoreButton && moreComments && (
        <li className="comment-thread-list__item">
          <CommentWrapper onCollapseButtonClick={() => loadMoreComments()}>
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => loadMoreComments()}
            >
              {getMoreCommentsMessage(moreComments)}
              {isLoadingMore && (
                <span className="comment-thread-list__loader">
                  <Loader size="sm" />
                </span>
              )}
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
