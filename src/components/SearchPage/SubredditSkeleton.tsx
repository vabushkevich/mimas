import React from "react";

import { Card, Skeleton } from "@components";
import "./Subreddit.scss";

export function SubredditSkeleton() {
  return (
    <div className="subreddit">
      <Card>
        <div className="subreddit__body">
          <div className="subreddit__avatar">
            <Skeleton width={46} height={46} circle block />
          </div>
          <div className="subreddit__info">
            <div className="subreddit__name">
              <Skeleton width={120} />
            </div>
            <div className="subreddit__member-count">
              <Skeleton width={90} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
