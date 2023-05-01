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
import { uniqBy } from "lodash-es";

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
    limit: 20,
    sort,
    sortTimeInterval,
    subreddit,
    userName,
  });
  const posts = uniqBy(pages.flat(), (post) => post.id);

  return (
    <div className="feed">
      <div className="feed__sort">
        <Card>
          <div className="feed__sort-body">
            <DropdownMenu
              label={(selectedContent) => selectedContent}
              selectable
              value={sort}
              onItemClick={(value) => {
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
                label={(selectedContent) => selectedContent}
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
        </Card>
      </div>
      <PostList
        posts={posts}
        primaryAuthorType={primaryAuthorType}
        unmarkPinned={unmarkPinned}
      />
      {isFetching && <PostListSkeleton />}
      {!isFetching && hasNextPage && (
        <IntersectionDetector
          marginTop={1200}
          onIntersect={fetchNextPage}
        />
      )}
    </div>
  );
}
