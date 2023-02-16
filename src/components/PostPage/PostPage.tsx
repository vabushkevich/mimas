import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToggleArrayValue } from "@hooks";
import { useQueryString } from "@hooks";
import { createId } from "@utils";
import {
  Post as PostType,
  CommentSortingMethod,
  isCommentSortingMethod,
} from "@types";
import {
  CollapsedThreadsContext,
} from "@context";
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
} from "@components";
import "./PostPage.scss";

const commentsSortingMenu: {
  content: string;
  value: CommentSortingMethod;
}[] = [
  { value: "confidence", content: "Best" },
  { value: "top", content: "Top" },
  { value: "new", content: "New" },
  { value: "controversial", content: "Controversial" },
  { value: "old", content: "Old" },
  { value: "qa", content: "Q&A" },
];

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
  const { data: post, isLoading } = usePost(postId);
  const {
    data: threadList,
  } = usePostComments(postId, { sort: commentsSorting });
  const [collapsedThreadIds, toggleThread] = useToggleArrayValue<string>();
  const history = useHistory();

  const {
    mutate: loadMoreComments,
  } = useLoadMoreComments();

  const { archived, locked, removalReason } = post || {};
  const hasAlerts = archived || locked || removalReason;

  return (
    <Page>
      <Container>
        {post && (
          <Post
            {...post}
            collapsed={false}
            pinned={false}
          />
        )}
        {isLoading && <div>Loading...</div>}
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
        {threadList && (
          <>
            <div className="comments-sorting">
              <Card>
                <DropdownMenu
                  items={commentsSortingMenu}
                  label={({ content }) => content}
                  selectedValue={commentsSorting}
                  onSelect={({ value }) => {
                    history.replace({ search: `?sort=${value}` });
                  }}
                />
              </Card>
            </div>
            <div className="comments">
              <Card>
                <CollapsedThreadsContext.Provider
                  value={{ collapsedThreadIds, toggleThread }}
                >
                  <CommentThreadList
                    commentIds={threadList.rootCommentIds}
                    moreComments={threadList.moreComments}
                  />
                </CollapsedThreadsContext.Provider>
              </Card>
            </div>
            {threadList.moreComments && (
              <IntersectionDetector
                marginTop={100}
                onIntersect={loadMoreComments}
              />
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
