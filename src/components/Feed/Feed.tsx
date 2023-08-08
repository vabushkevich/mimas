import React from "react";
import {
  PostSortingMethod,
  SortTimeInterval,
  isSortRequiresTimeInterval,
  isPostSortingMethod,
  isSortTimeInterval,
  AuthorType,
  FeedType,
} from "@types";
import { useFeedPosts } from "@services/api";
import { uniqBy } from "lodash-es";

import {
  PostList,
  IntersectionDetector,
  DropdownMenu,
  PostListSkeleton,
  MenuItem,
  DropdownButton,
} from "@components";
import "./Feed.scss";

type FeedProps = {
  enableBestSort?: boolean;
  primaryAuthorType?: AuthorType;
  sort?: PostSortingMethod;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  type: FeedType;
  unmarkPinned?: boolean;
  userName?: string;
  onSortChange?: (v: PostSortingMethod) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
};

export function Feed({
  enableBestSort = false,
  primaryAuthorType,
  sort,
  sortTimeInterval = "day",
  subreddit,
  type,
  unmarkPinned,
  userName,
  onSortChange,
  onSortTimeIntervalChange,
}: FeedProps) {
  if (!sort || (sort == "best" && !enableBestSort)) sort = "hot";

  const { data, fetchNextPage, hasNextPage, isFetching } = useFeedPosts({
    limit: 20,
    sort,
    sortTimeInterval,
    subreddit,
    userName,
  });
  const posts = uniqBy(data?.pages?.flat(), (post) => post.id);

  return (
    <div className="feed">
      <div className="feed__sort">
        <DropdownMenu
          button={(selectedContent) => (
            <DropdownButton color="clear" pill>
              {selectedContent}
            </DropdownButton>
          )}
          selectable
          value={sort}
          onItemClick={(value) => {
            if (isPostSortingMethod(value)) onSortChange?.(value);
          }}
        >
          {enableBestSort && <MenuItem value="best">Best</MenuItem>}
          <MenuItem value="hot">Hot</MenuItem>
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="rising">Rising</MenuItem>
          <MenuItem value="controversial">Controversial</MenuItem>
        </DropdownMenu>
        {sort && isSortRequiresTimeInterval(sort) && (
          <DropdownMenu
            button={(selectedContent) => (
              <DropdownButton color="clear" pill>
                {selectedContent}
              </DropdownButton>
            )}
            selectable
            value={sortTimeInterval}
            onItemClick={(value) => {
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
      <PostList
        feedType={type}
        posts={posts}
        primaryAuthorType={primaryAuthorType}
        unmarkPinned={unmarkPinned}
      />
      {isFetching && <PostListSkeleton />}
      {!isFetching && hasNextPage && (
        <IntersectionDetector marginTop={1200} onIntersect={fetchNextPage} />
      )}
    </div>
  );
}
