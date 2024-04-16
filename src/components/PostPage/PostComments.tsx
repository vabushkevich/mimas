import React from "react";
import { Link } from "react-router-dom";
import {
  CommentSortingOption,
  CommentThreadList as CommentThreadListType,
  isCommentSortingOption,
} from "@types";

import {
  CommentThreadList,
  DropdownMenu,
  MenuItem,
  Card,
  Alert,
  CommentForm,
  DropdownButton,
  UserContent,
} from "@components";
import "./PostPage.scss";

type PostCommentsProps = {
  commentCount: number;
  isPostArchived?: boolean;
  isPostLocked?: boolean;
  postId: string;
  postURL: string;
  singleThreaded?: boolean;
  sort?: CommentSortingOption;
  threadList: CommentThreadListType;
  onCommentSortingChange?: (v: CommentSortingOption) => void;
};

function getHeadingText(commentCount?: number) {
  if (commentCount && commentCount > 1) return `${commentCount} comments`;
  if (commentCount == 1) return "1 comment";
  return "Comments";
}

export function PostComments({
  commentCount,
  isPostArchived,
  isPostLocked,
  postId,
  postURL,
  singleThreaded,
  sort = "confidence",
  threadList,
  onCommentSortingChange,
}: PostCommentsProps) {
  const alertMessage = (() => {
    if (isPostArchived) {
      return "Post archived. Commenting and voting are not available.";
    }
    if (isPostLocked) {
      return "Post locked. Commenting is not available.";
    }
  })();

  return (
    <div className="post-comments">
      <Card>
        <div className="post-comments__body">
          {singleThreaded && (
            <div className="post-comments__top-message">
              <UserContent>
                Single comment thread.{" "}
                <Link to={`${postURL}?comments`}>Show all comments</Link>
              </UserContent>
            </div>
          )}
          {(!singleThreaded || alertMessage) && (
            <div className="post-comments__header">
              {!singleThreaded && (
                <div className="post-comments__heading-row">
                  <h3 className="post-comments__heading">
                    {getHeadingText(commentCount)}
                  </h3>
                  {commentCount > 1 && (
                    <DropdownMenu
                      alignRight
                      button={(selectedContent) => (
                        <DropdownButton variant="text">
                          {selectedContent}
                        </DropdownButton>
                      )}
                      selectable
                      value={sort}
                      onItemClick={(value) => {
                        if (isCommentSortingOption(value)) {
                          onCommentSortingChange?.(value);
                        }
                      }}
                    >
                      <MenuItem value="confidence">Best</MenuItem>
                      <MenuItem value="top">Top</MenuItem>
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="controversial">Controversial</MenuItem>
                      <MenuItem value="old">Old</MenuItem>
                      <MenuItem value="qa">Q&A</MenuItem>
                    </DropdownMenu>
                  )}
                </div>
              )}
              <div className="post-comments__comment-form">
                {alertMessage ? (
                  <Alert>{alertMessage}</Alert>
                ) : (
                  <CommentForm parentId={postId} />
                )}
              </div>
            </div>
          )}
          {threadList.rootCommentIds.length > 0 && (
            <div className="post-comments__thread-list">
              <CommentThreadList
                autoLoadMoreComments
                commentIds={threadList.rootCommentIds}
                moreComments={threadList.moreComments}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
