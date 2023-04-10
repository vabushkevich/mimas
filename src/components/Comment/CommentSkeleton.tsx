import React from "react";

import {
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
  UserContent,
} from "@components";
import "./Comment.scss";

export function CommentSkeleton() {
  return (
    <div className="comment">
      <SubmissionHeaderSkeleton />
      <div className="comment__body">
        <UserContent>
          <Skeleton rows={2} />
        </UserContent>
      </div>
      <div className="comment__footer">
        <button className="comment__reply-btn">Reply</button>
        <div className="comment__voting">
          <VotingSkeleton />
        </div>
      </div>
    </div>
  );
}
