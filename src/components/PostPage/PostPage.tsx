import React from "react";
import { usePostParams } from "@hooks";
import { usePost, usePostComments } from "@services/api";

import { Post, Container, Page, PostSkeleton } from "@components";
import { PostComments } from "./PostComments";
import { PostCommentsSkeleton } from "./PostCommentsSkeleton";
import "./PostPage.scss";

export function PostPage() {
  const { postId, commentSorting } = usePostParams();
  const { data: post, isLoading: isPostLoading } = usePost(postId);
  const { data: threadList, isLoading: isCommentsLoading } = usePostComments(
    postId,
    {
      limit: 100,
      sort: commentSorting,
    },
  );

  return (
    <Page title={post?.title}>
      <Container>
        {post && <Post post={post} collapsed={false} titleClickable={false} />}
        {isPostLoading && <PostSkeleton />}
        <div className="post-page__comments">
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
          {(isCommentsLoading || isPostLoading) && (
            <PostCommentsSkeleton count={10} />
          )}
        </div>
      </Container>
    </Page>
  );
}
