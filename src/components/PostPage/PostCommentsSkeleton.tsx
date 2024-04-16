import React from "react";

import {
  Card,
  CommentThreadListSkeleton,
  DropdownButtonSkeleton,
  Skeleton,
} from "@components";
import "./PostComments.scss";

export function PostCommentsSkeleton() {
  return (
    <div className="post-comments">
      <Card>
        <div className="post-comments__body">
          <div className="post-comments__header">
            <div className="post-comments__heading-row">
              <h3 className="post-comments__heading">
                <Skeleton width={30} /> comments
              </h3>
              <DropdownButtonSkeleton variant="text" contentWidth={40} />
            </div>
            <div className="post-comments__comment-form">
              <Skeleton block height={90} />
            </div>
          </div>
          <div className="post-comments__thread-list">
            <CommentThreadListSkeleton />
          </div>
        </div>
      </Card>
    </div>
  );
}
