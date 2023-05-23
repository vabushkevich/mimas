import React from "react";

import {
  Card,
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
} from "@components";
import "./BasePost.scss";

type BasePostSkeletonProps = {
  children?: React.ReactNode;
};

export function BasePostSkeleton({ children }: BasePostSkeletonProps) {
  return (
    <Card>
      <div className="post">
        <div className="post__header">
          <SubmissionHeaderSkeleton />
        </div>
        <h3 className="post__title">
          <Skeleton width="70%" />
        </h3>
        <div className="post__body">{children}</div>
        <div className="post__footer">
          <span className="post__comments-btn">
            <Skeleton width={30} />
          </span>
          <span className="post__save-btn"></span>
          <div className="post__voting">
            <VotingSkeleton />
          </div>
        </div>
      </div>
    </Card>
  );
}
