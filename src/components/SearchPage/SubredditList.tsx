import React from "react";
import { Subreddit as SubredditType } from "@types";

import { Subreddit } from "./Subreddit";
import { SubredditSkeleton } from "./SubredditSkeleton";
import "./SubredditList.scss";

type SubredditListProps = {
  columnCount?: number;
  isLoading?: boolean;
  skeletonCount?: number;
  subreddits: SubredditType[];
};

export function SubredditList({
  columnCount = 2,
  isLoading,
  skeletonCount = 2,
  subreddits,
}: SubredditListProps) {
  return (
    <ol
      className="subreddit-list"
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
    >
      {subreddits.map((subreddit) => (
        <li key={subreddit.id} className="subreddit-list__item">
          <Subreddit subreddit={subreddit} />
        </li>
      ))}
      {isLoading &&
        new Array(skeletonCount).fill(0).map((_, i) => (
          <li key={i} className="subreddit-list__item">
            <SubredditSkeleton />
          </li>
        ))}
    </ol>
  );
}
