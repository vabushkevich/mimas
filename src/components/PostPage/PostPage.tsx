import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToggleArrayValue } from "@hooks";
import { useComments } from "./hooks";
import { useAvatars, useQuery } from "@hooks";
import { createId } from "@utils";
import {
  Post as PostType,
  CommentSortingMethod,
  Submission,
  isCommentSortingMethod,
} from "@types";
import {
  CollapsedThreadsContext,
  CommentsContext,
  useAvatarsContext,
} from "@context";
import { usePost } from "@services/api";

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
  const query = useQuery<{ sort: string }>();
  const commentsSorting = isCommentSortingMethod(query.sort)
    ? query.sort
    : "confidence";

  const params = useParams<{ id: string }>();
  const postId = createId(params.id, "post");
  const { data: post, isLoading } = usePost(postId);
  const {
    comments,
    moreComments,
    rootCommentIds,
    loadMoreComments,
  } = useComments(postId, commentsSorting);
  const [collapsedThreadIds, toggleThread] = useToggleArrayValue<string>();
  const history = useHistory();

  const submissions: Submission[] = Object.values(comments);
  if (post) submissions.push(post);
  const avatars = useAvatars(submissions);
  const { addAvatars } = useAvatarsContext();

  const { archived, locked, removalReason } = post || {};
  const hasAlerts = archived || locked || removalReason;

  useEffect(() => {
    addAvatars(avatars);
  }, [avatars]);

  return (
    <Page>
      <Container>
        {post && (
          <Post
            {...post}
            collapsed={false}
            pinned={false}
            avatar={avatars[post.subredditId]}
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
        {Object.keys(comments).length > 0 && (
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
                  <CommentsContext.Provider
                    value={{ comments, loadMoreComments }}
                  >
                    <CommentThreadList
                      commentIds={rootCommentIds}
                      moreComments={moreComments}
                    />
                  </CommentsContext.Provider>
                </CollapsedThreadsContext.Provider>
              </Card>
            </div>
            {moreComments && (
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
