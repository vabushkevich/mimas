import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQueryString } from "@hooks";
import { createId } from "@utils";
import {
  Post as PostType,
  isCommentSortingMethod,
} from "@types";
import {
  usePost,
  usePostComments,
  useLoadMoreComments,
  usePostComment,
} from "@services/api";
import { useAuth, getAuthURL } from "@services/auth";

import {
  Post,
  Container,
  Page,
  CommentThreadList,
  DropdownMenu,
  MenuItem,
  Card,
  IntersectionDetector,
  Alert,
  PostSkeleton,
  CommentThreadListSkeleton,
  CommentForm,
  Button,
} from "@components";
import "./PostPage.scss";

const removalReasonMessages: Record<PostType["removalReason"], string> = {
  "rules-violation": "Post removed by Reddit for violating Reddit's rules.",
  "spam": "Post removed by Reddit's spam filters.",
  "user": "Post removed by author.",
  "moderator": "Post removed by subreddit moderator.",
};

export function PostPage() {
  const query = useQueryString<{ sort: string }>();
  const commentsSorting = isCommentSortingMethod(query.sort)
    ? query.sort
    : "confidence";

  const params = useParams<{ id: string }>();
  const postId = createId(params.id, "post");
  const {
    data: post,
    isLoading: isPostLoading,
  } = usePost(postId);
  const {
    data: threadList,
    isLoading: isPostCommentsLoading,
  } = usePostComments(postId, { sort: commentsSorting });
  const history = useHistory();
  const { authorized } = useAuth();

  const {
    mutate: loadMoreComments,
    isLoading: isMoreCommentsLoading,
  } = useLoadMoreComments();

  const { mutateAsync: postComment } = usePostComment();

  const isCommentsLoading = isPostCommentsLoading || isMoreCommentsLoading;

  const { archived, locked, removalReason } = post || {};
  const hasAlerts = archived || locked || removalReason;

  return (
    <Page>
      <Container>
        {post && (
          <Post
            post={post}
            collapsed={false}
            hidePin
          />
        )}
        {isPostLoading && <PostSkeleton />}
        {hasAlerts && (
          <div className="alerts">
            <Card>
              <div className="alerts__body">
                {removalReason && (
                  <div className="alerts__item">
                    <Alert>{removalReasonMessages[removalReason]}</Alert>
                  </div>
                )}
                {archived && (
                  <div className="alerts__item">
                    <Alert>Post archived. Commenting and voting are not available.</Alert>
                  </div>
                )}
                {locked && !archived && (
                  <div className="alerts__item">
                    <Alert>Post locked. Commenting is not available.</Alert>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        {(threadList || isCommentsLoading) && (
          <>
            <div className="comments-sorting">
              <Card>
                <div className="comments-sorting__body">
                  <DropdownMenu
                    defaultValue={commentsSorting}
                    label={(selectedItem) => selectedItem?.content}
                    selectable
                    onSelect={(value) => {
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
              </Card>
            </div>
            {authorized ? (
              <div className="post-comment-form">
                <Card>
                  <div className="post-comment-form__body">
                    <CommentForm
                      onSubmit={(text) => {
                        postComment({ text, parentId: postId });
                      }}
                    />
                  </div>
                </Card>
              </div>
            ) : (
              <div className="auth-to-comment">
                <Card>
                  <div className="auth-to-comment__body">
                    <div className="auth-to-comment__message">
                      Sign in to post comments
                    </div>
                    <div className="auth-to-comment__button">
                      <Button onClick={() => location.assign(getAuthURL())}>
                        Sign in with Reddit
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            <div className="comments">
              <Card>
                <div className="comments__body">
                  {threadList && (
                    <CommentThreadList
                      commentIds={threadList.rootCommentIds}
                      hideLoadMoreButton
                      moreComments={threadList.moreComments}
                    />
                  )}
                  {isCommentsLoading && <CommentThreadListSkeleton />}
                  {threadList?.moreComments && !isCommentsLoading && (
                    <IntersectionDetector
                      marginTop={100}
                      onIntersect={loadMoreComments}
                    />
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </Container>
    </Page>
  );
}
