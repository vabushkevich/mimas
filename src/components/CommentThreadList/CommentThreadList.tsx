import React from "react";
import { MoreItems } from "@types";
import { useLoadMoreComments } from "@services/api";

import {
  CommentForm,
  CommentThread,
  CommentThreadListSkeleton,
  CommentWrapper,
  IntersectionDetector,
  Loader,
} from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  autoLoadMoreComments?: boolean;
  commentIds: string[];
  depth?: number;
  moreComments?: MoreItems;
  parentId?: string;
  showCommentForm?: boolean;
  onComment?: () => void;
  onCommentFormClose?: () => void;
};

function getMoreCommentsMessage(commentCount: number) {
  if (commentCount > 1) return `${commentCount} comments`;
  if (commentCount == 1) return "1 comment";
  return "More comments";
}

export function CommentThreadList({
  autoLoadMoreComments,
  commentIds,
  depth = 0,
  moreComments,
  parentId,
  showCommentForm,
  onComment,
  onCommentFormClose,
}: CommentThreadListProps) {
  const { mutate: loadMoreComments, isLoading: isMoreCommentsLoading } =
    useLoadMoreComments({ commentId: parentId });

  return (
    <div className="comment-thread-list">
      <ol className="comment-thread-list__list">
        {showCommentForm && parentId && (
          <li className="comment-thread-list__item">
            <CommentWrapper collapseButtonDisabled>
              <CommentForm
                autoFocus
                cancelable
                parentId={parentId}
                onCancel={onCommentFormClose}
                onSubmit={onComment}
              />
            </CommentWrapper>
          </li>
        )}
        {commentIds.map((commentId) => (
          <li key={commentId} className="comment-thread-list__item">
            <CommentThread commentId={commentId} depth={depth} />
          </li>
        ))}
        {!autoLoadMoreComments && moreComments && (
          <li className="comment-thread-list__item">
            <CommentWrapper collapseButtonDisabled>
              <button
                className="comment-thread-list__more-comments-btn"
                disabled={isMoreCommentsLoading}
                onClick={() => loadMoreComments()}
              >
                {getMoreCommentsMessage(moreComments.totalCount)}
              </button>
              {isMoreCommentsLoading && (
                <span className="comment-thread-list__loader">
                  <Loader size="sm" />
                </span>
              )}
            </CommentWrapper>
          </li>
        )}
        {isMoreCommentsLoading && autoLoadMoreComments && (
          <li className="comment-thread-list__item">
            <CommentThreadListSkeleton itemCount={3} />
          </li>
        )}
      </ol>
      {autoLoadMoreComments && moreComments && !isMoreCommentsLoading && (
        <IntersectionDetector
          rootMargin="0px 0px 100%"
          onEnter={loadMoreComments}
        />
      )}
    </div>
  );
}
