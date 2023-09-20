import React from "react";
import { Link } from "react-router-dom";
import { useAvatar } from "@services/api";
import { Comment as CommentType } from "@types";

import { Card, Comment } from "@components";
import "./CommentListItem.scss";

type CommentListItemProps = {
  comment: CommentType;
};

export function CommentListItem({ comment }: CommentListItemProps) {
  const commentAuthorAvatar = useAvatar(comment.userId);

  return (
    <Card>
      <div className="comment-list-item">
        <Link className="comment-list-item__post-link" to={comment.postUrl}>
          {comment.postTitle}
        </Link>
        <Comment
          avatar={commentAuthorAvatar}
          comment={comment}
          hideDistinction
          hideLock
          hidePin
          hideReplyButton
        />
      </div>
    </Card>
  );
}
