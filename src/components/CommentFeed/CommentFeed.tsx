import React from "react";
import { uniqBy } from "lodash-es";
import { useUserComments } from "@services/api";
import {
  CommentFeedSortingOption,
  SortTimeInterval,
  commentFeedSortingOptions,
} from "@types";

import {
  Feed,
  CommentList,
  IntersectionDetector,
  CommentListSkeleton,
  Info,
} from "@components";

type CommentFeedProps = {
  sort?: CommentFeedSortingOption;
  sortTimeInterval?: SortTimeInterval;
  userName: string;
  onSortChange?: (v: CommentFeedSortingOption) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
};

export function CommentFeed({
  sort = "new",
  sortTimeInterval,
  userName,
  onSortChange,
  onSortTimeIntervalChange,
}: CommentFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useUserComments({
      limit: 20,
      sort,
      sortTimeInterval,
      userName,
    });
  const comments = uniqBy(data?.pages?.flat(), (comment) => comment.id);

  return (
    <Feed
      sort={sort}
      sortingOptions={commentFeedSortingOptions}
      sortTimeInterval={sortTimeInterval}
      onSortChange={onSortChange}
      onSortTimeIntervalChange={onSortTimeIntervalChange}
    >
      <CommentList comments={comments} />
      {!isFetching && comments.length == 0 && (
        <Info>There are no comments here yet...</Info>
      )}
      {isFetching && (
        <CommentListSkeleton count={isFetchingNextPage ? 3 : 10} />
      )}
      {!isFetching && hasNextPage && (
        <IntersectionDetector
          rootMargin="0px 0px 100%"
          onIntersect={fetchNextPage}
        />
      )}
    </Feed>
  );
}
