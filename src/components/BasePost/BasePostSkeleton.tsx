import React from "react";

import {
  Card,
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
} from "@components";
import DotsIcon from "@assets/svg/dots.svg";
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
          <span className="post__control post__menu-btn">
            <DotsIcon className="post__dots-icon" />
          </span>
        </div>
        <div className="post__heading">
          <h3 className="post__title">
            <Skeleton width="70%" />
          </h3>
        </div>
        <div className="post__body">{children}</div>
        <div className="post__footer">
          <span className="post__control">
            <BubbleIcon className="post__control-icon" />
            <Skeleton width={30} />
          </span>
          <span className="post__control">
            <BookmarkIcon className="post__control-icon post__control-icon--activable" />
          </span>
          <div className="post__voting">
            <VotingSkeleton />
          </div>
        </div>
      </div>
    </Card>
  );
}
