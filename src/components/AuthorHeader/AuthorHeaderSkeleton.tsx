import React from "react";

import { Card, Skeleton, StatSkeleton, ButtonSkeleton } from "@components";
import "./AuthorHeader.scss";

type AuthorHeaderSkeletonProps = {
  showDescription?: boolean;
  showSubscribeButton?: boolean;
};

export function AuthorHeaderSkeleton({
  showDescription,
  showSubscribeButton,
}: AuthorHeaderSkeletonProps) {
  return (
    <div className="author-header">
      <Card>
        <div className="author-header__body">
          <div className="author-header__avatar">
            <Skeleton width="100%" height="100%" circle block />
          </div>
          <div className="author-header__header">
            <div className="author-header__name">
              <Skeleton width={160} />
            </div>
            {showSubscribeButton && <ButtonSkeleton contentWidth={80} />}
          </div>
          {showDescription && (
            <div className="author-header__description">
              <Skeleton rows={2} />
            </div>
          )}
          <div className="author-header__stats">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        </div>
      </Card>
    </div>
  );
}
