import React from "react";

import {
  SubmissionHeaderSkeleton,
  Skeleton,
  VotingSkeleton,
  UserContent,
} from "@components";
import DotsIcon from "@assets/svg/dots.svg";
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
        <button className="comment__control comment__reply-btn">Reply</button>
        <div className="comment__menu">
          <div className="comment__control comment__menu-btn">
            <DotsIcon className="comment__dots-icon" />
          </div>
        </div>
        <div className="comment__voting">
          <VotingSkeleton />
        </div>
      </div>
    </div>
  );
}
