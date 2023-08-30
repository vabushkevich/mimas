import React from "react";
import { useFeedPosts } from "@services/api";
import { uniqBy } from "lodash-es";
import {
  PostSortingOption,
  SortTimeInterval,
  FeedType,
  postSortingOptions,
} from "@types";

import {
  Feed,
  IntersectionDetector,
  PostList,
  PostListSkeleton,
} from "@components";

type FeedProps = {
  sort?: PostSortingOption;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  type: FeedType;
  userName?: string;
  onSortChange?: (v: PostSortingOption) => void;
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
    ? postSortingOptions
    : postSortingOptions.filter((v) => v != "best");

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
