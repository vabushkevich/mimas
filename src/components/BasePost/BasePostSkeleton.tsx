import React from "react";

import {
  Card,
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
} from "@components";
import BubbleIcon from "./assets/bubble.svg";
import BookmarkIcon from "./assets/bookmark.svg";
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
            <BubbleIcon className="post__icon" />
            <Skeleton width={30} />
          </span>
          <span className="post__save-btn">
            <BookmarkIcon className="post__icon" />
          </span>
          <div className="post__voting">
            <VotingSkeleton />
          </div>
        </div>
      </div>
    </Card>
  );
}
