import React from "react";
import { useFeedPosts } from "@services/api";
import { uniqBy } from "lodash-es";
import {
  PostFeedSortingOption,
  SortTimeInterval,
  FeedType,
  postFeedSortingOptions,
} from "@types";

import { Feed } from "../Feed/Feed";
import { Info } from "../Info/Info";
import { IntersectionDetector } from "../IntersectionDetector/IntersectionDetector";
import { PostList } from "../PostList/PostList";

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
  if (sort) {
    if (sort == "best" && !bestSortEnabled) sort = "hot";
  } else {
    sort = type == "user" ? "new" : "hot";
  }

  const { data, fetchNextPage, hasNextPage, isFetching } = useFeedPosts({
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
        hideFlairs={type != "subreddit"}
        hidePins={type == "subreddit" && sort != "hot"}
        isLoading={isFetching}
        posts={posts}
        showSubreddits={type != "subreddit"}
      />
      {!isFetching && posts.length == 0 && (
        <Info>There are no posts here yet...</Info>
      )}
      {!isFetching && hasNextPage && (
        <IntersectionDetector
          rootMargin="0px 0px 100%"
          onEnter={fetchNextPage}
        />
      )}
    </Feed>
  );
}
