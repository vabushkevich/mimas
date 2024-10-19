import React from "react";

import { Card } from "../Card/Card";
import { CommentSkeleton } from "../Comment/CommentSkeleton";
import { Skeleton } from "../Skeleton/Skeleton";
import "./CommentListItem.scss";

export function CommentListItemSkeleton() {
  return (
    <Card>
      <div className="comment-list-item">
        <div className="comment-list-item__post-link">
          <Skeleton width={170} />
        </div>
        <CommentSkeleton />
      </div>
    </Card>
  );
}
