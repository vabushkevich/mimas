import React from "react";

import {
  Card,
  CommentThreadList,
  DropdownButtonSkeleton,
  Skeleton,
} from "@components";
import "./PostComments.scss";

export function PostCommentsSkeleton() {
  return (
    <div className="post-comments">
      <Card>
        <div className="post-comments__body">
          <div className="post-comments__container">
            <div className="post-comments__header">
              <h3 className="post-comments__heading">
                <Skeleton width={30} /> comments
              </h3>
              <div className="post-comments__sorting">
                <DropdownButtonSkeleton variant="text" contentWidth={40} />
              </div>
            </div>
          </div>
          <div className="post-comments__container">
            <Skeleton block height={90} />
          </div>
          <div className="post-comments__thread-list">
            <CommentThreadList commentIds={[]} isLoading />
          </div>
        </div>
      </Card>
    </div>
  );
}
