import React, { useState, useEffect, useContext } from "react";
import { useToggleArrayValue } from "@hooks";
import { useComments, useUsers } from "./hooks";
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
  text: string;
  value: CommentSortingMethod;
}[] = [
  { text: "Best", value: "confidence" },
  { text: "Top", value: "top" },
  { text: "New", value: "new" },
  { text: "Controversial", value: "controversial" },
  { text: "Old", value: "old" },
  { text: "Q&A", value: "qa" },
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
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];
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
      const post = (await client.getPosts([postId]))[0];
      setPost(post);
    })();
  }, []);

  return (
    <Page>
      <Container>
        {post ? <Post {...post} collapsed={false} /> : <div>Loading...</div>}
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
                  buttonText={commentsSortingMenu
                    .find((item) => item.value == commentsSorting)
                    .text
                  }
                >
                  {commentsSortingMenu.map(({ value, text }) => (
                    <MenuItem
                      key={value}
                      selected={value == commentsSorting}
                      onClick={() => setCommentsSorting(value)}
                    >
                      {text}
                    </MenuItem>
                  ))}
                </DropdownMenu>
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
