import React from "react";
import { useParams } from "react-router-dom";
import { useQueryString } from "@hooks";
import { createId } from "@utils";
import { isCommentSortingOption } from "@types";
import { usePost, usePostComments } from "@services/api";

import { Post, Container, Page, PostSkeleton } from "@components";
import { PostComments } from "./PostComments";
import { PostCommentsSkeleton } from "./PostCommentsSkeleton";
import "./PostPage.scss";

export function PostPage() {
  const query = useQueryString<{ sort: string }>();
  const commentsSorting = isCommentSortingOption(query.sort)
    ? query.sort
    : "confidence";
  const params = useParams<{ id: string }>();
  const postId = createId(params.id, "post");
  const { data: post, isLoading: isPostLoading } = usePost(postId);
  const { data: threadList, isLoading: isCommentsLoading } = usePostComments(
    postId,
    {
      limit: 100,
      sort: commentsSorting,
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
              sort={commentsSorting}
              threadList={threadList}
            />
          )}
          {(isCommentsLoading || isPostLoading) && <PostCommentsSkeleton />}
        </div>
      </Container>
    </Page>
  );
}
