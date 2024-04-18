import React from "react";

import { Card, CommentSkeleton, Skeleton } from "@components";
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
