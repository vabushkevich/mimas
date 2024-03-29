import React from "react";
import {
  CommentSortingOption,
  CommentThreadList as CommentThreadListType,
  isCommentSortingOption,
} from "@types";
import { useLoadMoreComments, usePostComment } from "@services/api";
import { useAuth } from "@services/auth";

import {
  CommentThreadList,
  DropdownMenu,
  MenuItem,
  Card,
  IntersectionDetector,
  Alert,
  CommentForm,
  Button,
  DropdownButton,
} from "@components";
import "./PostPage.scss";

type PostCommentsProps = {
  commentCount: number;
  isPostArchived?: boolean;
  isPostLocked?: boolean;
  postId: string;
  sort?: CommentSortingOption;
  threadList: CommentThreadListType;
  onCommentSortingChange?: (v: CommentSortingOption) => void;
};

function getHeadingText(commentCount?: number) {
  if (commentCount && commentCount > 1) return `${commentCount} comments`;
  if (commentCount == 1) return "1 comment";
  return "Comments";
}

export function PostComments({
  commentCount,
  isPostArchived,
  isPostLocked,
  postId,
  sort = "confidence",
  threadList,
  onCommentSortingChange,
}: PostCommentsProps) {
  const { authorized, signIn } = useAuth();
  const { mutateAsync: postComment } = usePostComment();
  const { mutate: loadMoreComments, isLoading: isMoreCommentsLoading } =
    useLoadMoreComments();

  const alertMessage = (() => {
    if (isPostArchived) {
      return "Post archived. Commenting and voting are not available.";
    }
    if (isPostLocked) {
      return "Post locked. Commenting is not available.";
    }
  })();
  const showCommentForm = !alertMessage && authorized;
  const showSignInOffer = !alertMessage && !authorized;

  return (
    <div className="post-comments">
      <Card>
        <div className="post-comments__body">
          <div className="post-comments__container">
            <div className="post-comments__header">
              <h3 className="post-comments__heading">
                {getHeadingText(commentCount)}
              </h3>
              {commentCount > 1 && (
                <div className="post-comments__sorting">
                  <DropdownMenu
                    alignRight
                    button={(selectedContent) => (
                      <DropdownButton variant="text">
                        {selectedContent}
                      </DropdownButton>
                    )}
                    selectable
                    value={sort}
                    onItemClick={(value) => {
                      if (isCommentSortingOption(value)) {
                        onCommentSortingChange?.(value);
                      }
                    }}
                  >
                    <MenuItem value="confidence">Best</MenuItem>
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="controversial">Controversial</MenuItem>
                    <MenuItem value="old">Old</MenuItem>
                    <MenuItem value="qa">Q&A</MenuItem>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
          <div className="post-comments__container">
            {alertMessage && <Alert>{alertMessage}</Alert>}
            {showCommentForm && (
              <CommentForm
                onSubmit={(text) => postComment({ text, parentId: postId })}
              />
            )}
            {showSignInOffer && (
              <div className="post-comments__sign-in-offer">
                <div className="post-comments__sign-in-offer-text">
                  Sign in to post comments
                </div>
                <Button size="sm" onClick={signIn}>
                  Sign in with Reddit
                </Button>
              </div>
            )}
          </div>
          {threadList.rootCommentIds.length > 0 && (
            <div className="post-comments__thread-list">
              <CommentThreadList
                commentIds={threadList.rootCommentIds}
                hideLoadMoreButton
                isLoading={isMoreCommentsLoading}
                moreComments={threadList.moreComments}
              />
              {threadList.moreComments && !isMoreCommentsLoading && (
                <IntersectionDetector
                  rootMargin="0px 0px 100%"
                  onEnter={loadMoreComments}
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
