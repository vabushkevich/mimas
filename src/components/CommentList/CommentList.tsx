import React from "react";
import { Link } from "react-router-dom";
import { useAvatar } from "@services/api";
import { Comment as CommentType } from "@types";

import { Card, Comment } from "@components";
import "./CommentList.scss";

type CommentListProps = {
  comments: CommentType[];
};

export function CommentList({ comments }: CommentListProps) {
  const commentAuthorAvatar = useAvatar(comments[0]?.userId);

  return (
    <ol className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-list__item">
          <Card>
            <div className="comment-list__item-body">
              <Link className="comment-list__post-link" to={comment.postUrl}>
                {comment.postTitle}
              </Link>
              <Comment
                comment={comment}
                avatar={commentAuthorAvatar}
                hideDistinction
                hideLock
                hidePin
                hideReplyButton
              />
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
