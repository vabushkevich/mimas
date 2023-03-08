import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQueryString } from "@hooks";
import { createId } from "@utils";
import {
  Post as PostType,
  isCommentSortingMethod,
} from "@types";
import { usePost, usePostComments, useLoadMoreComments } from "@services/api";

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

  const {
    mutate: loadMoreComments,
    isLoading: isMoreCommentsLoading,
  } = useLoadMoreComments();

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
            </Card>
          </div>
        )}
        {(threadList || isCommentsLoading) && (
          <>
            <div className="comments-sorting">
              <Card>
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
              </Card>
            </div>
            <div className="comments">
              <Card>
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
              </Card>
            </div>
          </>
        )}
      </Container>
    </Page>
  );
}
