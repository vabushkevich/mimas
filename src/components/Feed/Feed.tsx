import React from "react";
import {
  PostSortingMethod,
  SortTimeInterval,
  isSortRequiresTimeInterval,
  isPostSortingMethod,
  isSortTimeInterval,
  AuthorType,
} from "@types";
import { useFeedPosts } from "@services/api";

import {
  PostList,
  IntersectionDetector,
  Card,
  DropdownMenu,
  PostListSkeleton,
  MenuItem,
} from "@components";
import "./Feed.scss";

type FeedProps = {
  primaryAuthorType?: AuthorType;
  sort?: PostSortingMethod;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  unmarkPinned?: boolean;
  userName?: string;
  onSortChange?: (v: PostSortingMethod) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
};

export function Feed({
  primaryAuthorType,
  sort,
  sortTimeInterval,
  subreddit,
  unmarkPinned,
  userName,
  onSortChange,
  onSortTimeIntervalChange,
}: FeedProps) {
  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useFeedPosts({
    limit: 5,
    sort,
    sortTimeInterval,
    subreddit,
    userName,
  });
  const posts = pages.flat();

  return (
    <div className="feed">
      <div className="feed__sort">
        <Card>
          <div className="feed__sort-items">
            <DropdownMenu
              defaultValue={sort}
              label={(selectedItem) => selectedItem?.content}
              selectable
              onSelect={(value) => {
                if (isPostSortingMethod(value)) onSortChange?.(value);
              }}
            >
              <MenuItem value="best">Best</MenuItem>
              <MenuItem value="hot">Hot</MenuItem>
              <MenuItem value="top">Top</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="rising">Rising</MenuItem>
              <MenuItem value="controversial">Controversial</MenuItem>
            </DropdownMenu>
            {isSortRequiresTimeInterval(sort) && (
              <DropdownMenu
                defaultValue={sortTimeInterval}
                label={(selectedItem) => selectedItem?.content}
                selectable
                onSelect={(value) => {
                  if (isSortTimeInterval(value)) {
                    onSortTimeIntervalChange?.(value);
                  }
                }}
              >
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </DropdownMenu>
            )}
          </div>
        </Card>
      </div>
      <PostList
        posts={posts}
        primaryAuthorType={primaryAuthorType}
        unmarkPinned={unmarkPinned}
      />
      {isFetching && <PostListSkeleton />}
      {hasNextPage && (
        <IntersectionDetector
          marginTop={100}
          onIntersect={fetchNextPage}
        />
      )}
    </div>
  );
}
