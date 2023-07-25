import React from "react";
import { useHistory } from "react-router-dom";
import type {
  CommentSortingMethod,
  CommentThreadList as CommentThreadListType,
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
  CommentThreadListSkeleton,
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
  sort: CommentSortingMethod;
  threadList: CommentThreadListType;
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
  sort,
  threadList,
}: PostCommentsProps) {
  const history = useHistory();
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
                      history.replace({ search: `?sort=${value}` });
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
                moreComments={threadList.moreComments}
              />
              {isMoreCommentsLoading && <CommentThreadListSkeleton />}
              {threadList.moreComments && !isMoreCommentsLoading && (
                <IntersectionDetector
                  marginTop={1200}
                  onIntersect={loadMoreComments}
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
