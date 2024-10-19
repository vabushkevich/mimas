import React from "react";
import { Link } from "react-router-dom";
import { Comment as CommentType } from "@types";

import { Card } from "../Card/Card";
import { Comment } from "../Comment/Comment";
import "./CommentListItem.scss";

type CommentListItemProps = {
  comment: CommentType;
};

export function CommentListItem({ comment }: CommentListItemProps) {
  return (
    <Card>
      <div className="comment-list-item">
        <Link className="comment-list-item__post-link" to={comment.postUrl}>
          {comment.postTitle}
        </Link>
        <Comment
          comment={comment}
          hideDistinction
          hideFlair
          hideLock
          hidePin
          replyInline={false}
        />
      </div>
    </Card>
  );
}
