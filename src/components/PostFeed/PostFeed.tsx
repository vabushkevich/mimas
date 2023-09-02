import React from "react";
import { useFeedPosts } from "@services/api";
import { uniqBy } from "lodash-es";
import {
  PostFeedSortingOption,
  SortTimeInterval,
  FeedType,
  postFeedSortingOptions,
} from "@types";

import {
  Feed,
  IntersectionDetector,
  PostList,
  PostListSkeleton,
} from "@components";

type FeedProps = {
  sort?: PostFeedSortingOption;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  type: FeedType;
  userName?: string;
  onSortChange?: (v: PostFeedSortingOption) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
};

export function PostFeed({
  sort,
  sortTimeInterval,
  subreddit,
  type,
  userName,
  onSortChange,
  onSortTimeIntervalChange,
}: FeedProps) {
  const bestSortEnabled = subreddit == "";
  if (!sort || (sort == "best" && !bestSortEnabled)) sort = "hot";

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFeedPosts({
      limit: 20,
      sort,
      sortTimeInterval,
      subreddit,
      userName,
    });
  const posts = uniqBy(data?.pages?.flat(), (post) => post.id);
  const sortingOptions = bestSortEnabled
    ? postFeedSortingOptions
    : postFeedSortingOptions.filter((v) => v != "best");

  return (
    <Feed
      sort={sort}
      sortingOptions={sortingOptions}
      sortTimeInterval={sortTimeInterval}
      onSortChange={onSortChange}
      onSortTimeIntervalChange={onSortTimeIntervalChange}
    >
      <PostList
        feedType={type}
        hidePins={type == "subreddit" && sort != "hot"}
        posts={posts}
        primaryAuthorType={type == "subreddit" ? "user" : "subreddit"}
      />
      {isFetching && <PostListSkeleton count={isFetchingNextPage ? 3 : 10} />}
      {!isFetching && hasNextPage && (
        <IntersectionDetector marginTop={1200} onIntersect={fetchNextPage} />
      )}
    </Feed>
  );
}
