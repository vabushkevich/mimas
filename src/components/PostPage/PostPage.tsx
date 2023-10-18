import React, { useLayoutEffect, useRef } from "react";
import { useNavigationType, usePostParams } from "@hooks";
import { usePost, usePostComments } from "@services/api";

import { Post, Container, Page, PostSkeleton } from "@components";
import { PostComments } from "./PostComments";
import { PostCommentsSkeleton } from "./PostCommentsSkeleton";
import "./PostPage.scss";

export function PostPage() {
  const { postId, commentSorting, shouldScrollToComments } = usePostParams();
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
            />
          )}
          {(isCommentsLoading || isPostLoading) && <PostCommentsSkeleton />}
        </div>
      </Container>
    </Page>
  );
}
