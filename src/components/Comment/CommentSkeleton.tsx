import React from "react";

import { SubmissionHeaderSkeleton, Skeleton } from "@components";
import "./Comment.scss";

export function CommentSkeleton() {
  return (
    <div className="comment">
      <SubmissionHeaderSkeleton />
      <div className="comment__body">
        <Skeleton rows={2} />
      </div>
      <div className="comment__footer">
        <button className="comment__reply-btn">Reply</button>
        <div className="comment__voting">
          <button className="comment__down-btn"></button>
          <div className="comment__score">
            <Skeleton width={30} />
          </div>
          <button className="comment__up-btn"></button>
        </div>
      </div>
    </div>
  );
}
