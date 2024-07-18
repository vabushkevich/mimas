import React from "react";
import { Link } from "react-router-dom";
import {
  CommentSortingOption,
  CommentThreadList as CommentThreadListType,
} from "@types";

import {
  Alert,
  Card,
  CommentForm,
  CommentThreadList,
  Select,
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
                    <Select
                      alignRight
                      options={[
                        { value: "confidence", label: "Best" },
                        { value: "top", label: "Top" },
                        { value: "new", label: "New" },
                        { value: "controversial", label: "Controversial" },
                        { value: "old", label: "Old" },
                        { value: "qa", label: "Q&A" },
                      ]}
                      value={sort}
                      variant="text"
                      onSelect={(value) => onCommentSortingChange?.(value)}
                    />
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
