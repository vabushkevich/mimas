import React from "react";

import {
  Card,
  CommentThreadListSkeleton,
  DropdownButtonSkeleton,
  Skeleton,
} from "@components";
import "./PostComments.scss";

type PostCommentsSkeletonProps = {
  count?: number;
};

export function PostCommentsSkeleton({ count }: PostCommentsSkeletonProps) {
  return (
    <div className="post-comments">
      <Card>
        <div className="post-comments__body">
          <div className="post-comments__container">
            <div className="post-comments__header">
              <h3 className="post-comments__heading">
                <Skeleton width={30} /> comments
              </h3>
              <div className="post-comments__sorting">
                <DropdownButtonSkeleton variant="text" contentWidth={40} />
              </div>
            </div>
          </div>
          <div className="post-comments__container">
            <Skeleton block height={90} />
          </div>
          <div className="post-comments__thread-list">
            <CommentThreadListSkeleton count={count} />
          </div>
        </div>
      </Card>
    </div>
  );
}
