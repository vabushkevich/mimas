import React from "react";

import { Skeleton } from "@components";
import "./SubmissionHeader.scss";

export function SubmissionHeaderSkeleton() {
  return (
    <div className="submission-header">
      <span className="author-link">
        <div className="author-link__avatar">
          <Skeleton width={20} height={20} circle block />
        </div>
        <div className="author-link__name">
          <Skeleton width={60} />
        </div>
      </span>
      <span>
        <Skeleton width={120} />
      </span>
      <div className="submission-header__date">
        <Skeleton width={25} />
      </div>
    </div>
  );
}
