import React from "react";
import { MoreItems } from "@types";
import { useLoadMoreComments, usePostComment } from "@services/api";

import {
  CommentThread,
  CommentWrapper,
  Spinner,
  CommentForm,
} from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  commentIds: string[];
  hideLoadMoreButton?: boolean;
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
  hideLoadMoreButton,
  moreComments,
  parentId,
  showReplyForm = false,
  onReply,
}: CommentThreadListProps) {
  const { mutate: loadMoreComments, isLoading } = useLoadMoreComments({
    commentId: parentId,
  });
  const { mutateAsync: postComment } = usePostComment();

  return (
    <ol className="comment-thread-list">
      {showReplyForm && (
        <li className="comment-thread-list__item">
          <CommentWrapper>
            <CommentForm
              onSubmit={(text) => postComment({ text, parentId })}
              onSuccess={onReply}
            />
          </CommentWrapper>
        </li>
      )}
      {commentIds.map((commentId) => {
        return (
          <li key={commentId} className="comment-thread-list__item">
            <CommentThread commentId={commentId} />
          </li>
        );
      })}
      {!hideLoadMoreButton && moreComments && (
        <li className="comment-thread-list__item">
          <CommentWrapper onCollapseButtonClick={() => loadMoreComments()}>
            <button
              className="comment-thread-list__more-replies-btn"
              onClick={() => loadMoreComments()}
            >
              {getMoreCommentsMessage(moreComments)}
              {isLoading && (
                <span className="comment-thread-list__spinner">
                  <Spinner />
                </span>
              )}
            </button>
          </CommentWrapper>
        </li>
      )}
    </ol>
  );
}
