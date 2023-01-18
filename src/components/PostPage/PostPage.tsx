import React, { useState, useEffect, useContext } from "react";
import { useToggleArrayValue } from "@hooks";
import { useComments, useUsers } from "./hooks";
import { createId } from "@utils";
import {
  Post as PostType,
  CommentSortingMethod,
} from "@types";
import {
  ClientContext,
  CollapsedThreadsContext,
  CommentsContext,
  UsersContext,
} from "@context";

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
  const [post, setPost] = useState<PostType>();
  const [commentsSorting, setCommentsSorting] =
    useState<CommentSortingMethod>("confidence");
  const client = useContext(ClientContext);
  const postIdSuffix = location.pathname.match(/\/comments\/(\w+)\//)[1];
  const postId = createId(postIdSuffix, "post");
  const {
    comments,
    moreComments,
    rootCommentIds,
    loadMoreComments,
  } = useComments(postId, commentsSorting);
  const [collapsedThreadIds, toggleThread] = useToggleArrayValue<string>();
  const users = useUsers(comments);

  const { archived, locked, removalReason } = post || {};
  const hasAlerts = archived || locked || removalReason;

  useEffect(() => {
    (async () => {
      const post = await client.getPost(postId);
      setPost(post);
    })();
  }, []);

  return (
    <Page>
      <Container>
        {post ? <Post {...post} collapsed={false} pinned={false} /> : <div>Loading...</div>}
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
              {locked && (
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
                  onSelect={({ value }) => setCommentsSorting(value)}
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
                    <UsersContext.Provider value={users}>
                      <CommentThreadList
                        commentIds={rootCommentIds}
                        moreComments={moreComments}
                      />
                    </UsersContext.Provider>
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
