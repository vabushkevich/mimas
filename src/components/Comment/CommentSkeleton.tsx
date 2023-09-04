import React from "react";

import {
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
  UserContent,
} from "@components";
import "./Comment.scss";

type CommentSkeletonProps = {
  hideReplyButton?: boolean;
};

export function CommentSkeleton({ hideReplyButton }: CommentSkeletonProps) {
  return (
    <div className="comment">
      <SubmissionHeaderSkeleton />
      <div className="comment__body">
        <UserContent>
          <Skeleton rows={2} />
        </UserContent>
      </div>
      <div className="comment__footer">
        {!hideReplyButton && (
          <button className="comment__reply-btn">Reply</button>
        )}
        <div className="comment__voting">
          <VotingSkeleton />
        </div>
      </div>
    </div>
  );
}
