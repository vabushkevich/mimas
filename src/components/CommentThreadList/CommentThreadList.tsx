import React from "react";
import { MoreItems } from "@types";
import { useLoadMoreComments } from "@services/api";
import { useIsSmallScreen } from "@hooks";

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

export const baseIndent = 10;

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

  const isSmallScreen = useIsSmallScreen();
  const depthLimit = isSmallScreen ? 7 : 20;
  const limitedDepth = Math.min(depth, depthLimit);
  const indent = baseIndent + limitedDepth * (baseIndent + 4);

  return (
    <div className="comment-thread-list">
      {showCommentForm && parentId && (
        <div className="comment-thread-list__item">
          <CommentWrapper collapseButtonDisabled indent={indent}>
            <CommentForm
              autoFocus
              cancelable
              targetId={parentId}
              onCancel={onCommentFormClose}
              onSubmit={onComment}
            />
          </CommentWrapper>
        </div>
      )}
      {commentIds.map((commentId) => (
        <div key={commentId} className="comment-thread-list__item">
          <CommentThread commentId={commentId} depth={depth} indent={indent} />
        </div>
      ))}
      {!autoLoadMoreComments && moreComments && (
        <div className="comment-thread-list__item">
          <CommentWrapper collapseButtonDisabled indent={indent}>
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
        </div>
      )}
      {isMoreCommentsLoading && autoLoadMoreComments && (
        <div className="comment-thread-list__item">
          <CommentThreadListSkeleton itemCount={3} />
        </div>
      )}
      {autoLoadMoreComments && moreComments && !isMoreCommentsLoading && (
        <IntersectionDetector
          rootMargin="0px 0px 100%"
          onEnter={loadMoreComments}
        />
      )}
    </div>
  );
}
