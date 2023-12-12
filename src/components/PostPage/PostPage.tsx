import React, { useLayoutEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage, useNavigationType, usePostParams } from "@hooks";
import { usePost, usePostComments } from "@services/api";
import { CommentSortingOption } from "@types";

import { Post, Container, Page, PostSkeleton } from "@components";
import { PostComments } from "./PostComments";
import { PostCommentsSkeleton } from "./PostCommentsSkeleton";
import "./PostPage.scss";

export function PostPage() {
  const {
    postId,
    commentSorting: commentSortingParam,
    shouldScrollToComments,
  } = usePostParams();
  const [storedCommentSorting, storeCommentSorting] =
    useLocalStorage<CommentSortingOption>("comment-sorting");
  const commentSorting = commentSortingParam ?? storedCommentSorting;

  const history = useHistory();
  const navigationType = useNavigationType();
  const commentsRef = useRef<HTMLDivElement>(null);
  const { data: post, isLoading: isPostLoading } = usePost(postId);
  const { data: threadList, isLoading: isCommentsLoading } = usePostComments(
    postId,
    {
      limit: 100,
      sort: commentSorting,
    },
  );

  useLayoutEffect(() => {
    if (
      window.scrollY == 0 &&
      shouldScrollToComments &&
      navigationType == "NAVIGATE" &&
      (CSS.supports("overflow-anchor: auto") || !isPostLoading)
    ) {
      commentsRef.current?.scrollIntoView();
    }
  }, [shouldScrollToComments, navigationType, isPostLoading]);

  return (
    <Page title={post?.title}>
      <Container>
        {post && (
          <Post
            post={post}
            collapsed={false}
            large
            titleClickable={false}
            onCommentsButtonClick={(event) => {
              event.preventDefault();
              commentsRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}
        {isPostLoading && <PostSkeleton />}
        <div className="post-page__comments" ref={commentsRef}>
          {threadList && post && (
            <PostComments
              commentCount={post.commentCount}
              isPostArchived={post.archived}
              isPostLocked={post.locked}
              postId={postId}
              sort={commentSorting}
              threadList={threadList}
              onCommentSortingChange={(sort) => {
                history.replace({ search: `?sort=${sort}` });
                storeCommentSorting(sort);
              }}
            />
          )}
          {(isCommentsLoading || isPostLoading) && <PostCommentsSkeleton />}
        </div>
      </Container>
    </Page>
  );
}
