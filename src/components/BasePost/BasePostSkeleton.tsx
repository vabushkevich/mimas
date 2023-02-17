import React from "react";

import { Card, SubmissionHeaderSkeleton, Skeleton } from "@components";
import "./BasePost.scss";

export function BasePostSkeleton() {
  return (
    <Card>
      <div className="post">
        <SubmissionHeaderSkeleton />
        <h3 className="post__title">
          <Skeleton width={450} />
        </h3>
        <div className="post__body">
          <Skeleton rows={4} />
        </div>
        <div className="post__footer">
          <span className="post__comments-btn">
            <Skeleton width={30} />
          </span>
          <div className="post__voting">
            <button className="post__down-btn"></button>
            <div className="post__score">
              <Skeleton width={30} />
            </div>
            <button className="post__up-btn"></button>
          </div>
        </div>
      </div>
    </Card>
  );
}
