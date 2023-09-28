import React from "react";
import { uniqBy } from "lodash-es";
import { useSearchPosts } from "@services/api";

import { Info, IntersectionDetector, PostList } from "@components";

type PostSearchProps = {
  query: string;
};

export function PostSearch({ query }: PostSearchProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useSearchPosts(
    query,
    { limit: 20 },
  );
  const posts = uniqBy(data?.pages?.flat(), (v) => v.id);

  if (posts.length == 0 && !isFetching) {
    return <Info>No posts found</Info>;
  }

  return (
    <div>
      <PostList
        feedType="subreddit"
        hidePins
        isLoading={isFetching}
        posts={posts}
        primaryAuthorType="subreddit"
      />
      {!isFetching && hasNextPage && (
        <IntersectionDetector
          rootMargin="0px 0px 100%"
          onIntersect={fetchNextPage}
        />
      )}
    </div>
  );
}
