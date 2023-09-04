import React from "react";

import { Card, CommentSkeleton, Skeleton } from "@components";
import "./CommentList.scss";
import "./CommentListSkeleton.scss";

type CommentListSkeletonProps = {
  count?: number;
};

export function CommentListSkeleton({ count = 3 }: CommentListSkeletonProps) {
  return (
    <ol className="comment-list">
      {new Array(count).fill(0).map((v, i) => (
        <li key={i} className="comment-list__item">
          <Card>
            <div className="comment-list__item-body">
              <div className="comment-list__post-link">
                <Skeleton width={170} />
              </div>
              <CommentSkeleton hideReplyButton />
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
