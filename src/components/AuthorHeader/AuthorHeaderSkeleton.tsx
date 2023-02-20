import React from "react";

import { Card, Skeleton, StatSkeleton } from "@components";
import "./AuthorHeader.scss";

export function AuthorHeaderSkeleton() {
  return (
    <div className="author-header">
      <Card>
        <div className="author-header__picture">
          <Skeleton width="100%" height="100%" circle />
        </div>
        <div className="author-header__name">
          <Skeleton width={160} />
        </div>
        <div className="author-header__description">
          <Skeleton rows={2} />
        </div>
        <div className="author-header__stats">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      </Card>
    </div>
  );
}
