import React, { useLayoutEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage, useNavigationType, usePostParams } from "@hooks";
import { usePost, usePostComments } from "@services/api";
import { CommentSortingOption } from "@types";

import { Container } from "../Container/Container";
import { Page } from "../Page/Page";
import { Post } from "../Post/Post";
import { PostSkeleton } from "../Post/PostSkeleton";
import { PostComments } from "./PostComments";
import { PostCommentsSkeleton } from "./PostCommentsSkeleton";
import "./PostPage.scss";

export function PostPage() {
  const {
    postId,
    commentId,
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
    { commentId, limit: 100, sort: commentSorting },
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
  }, [shouldScrollToComments, navigationType, isPostLoading, history.location]);

  return (
    <Page title={post?.title}>
      <Container>
        {post && (
          <Post
            post={post}
            collapsed={false}
            large
            showAdditionalText
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
              postURL={post.url}
              singleThreaded={!!commentId}
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
