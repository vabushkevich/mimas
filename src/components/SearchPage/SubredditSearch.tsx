import React from "react";
import { uniqBy } from "lodash-es";
import { useIsSmallScreen } from "@hooks";
import { useSearchSubreddits } from "@services/api";

import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Info } from "../Info/Info";
import { Skeleton } from "../Skeleton/Skeleton";
import { SubredditList } from "./SubredditList";
import "./SubredditSearch.scss";

type SubredditSearchProps = {
  query: string;
};

export function SubredditSearch({ query }: SubredditSearchProps) {
  const isSmallScreen = useIsSmallScreen();
  const columnCount = isSmallScreen ? 1 : 2;
  const pageItemCount = isSmallScreen ? 4 : 8;
  const { data, fetchNextPage, hasNextPage, isFetching } = useSearchSubreddits(
    query,
    { limit: pageItemCount },
  );
  const subreddits = uniqBy(data?.pages?.flat(), (v) => v.id);

  if (subreddits.length == 0 && !isFetching) {
    return <Info>No subreddits found</Info>;
  }

  return (
    <Card>
      <div className="subreddit-search">
        <SubredditList
          columnCount={columnCount}
          isLoading={isFetching}
          skeletonCount={pageItemCount}
          subreddits={subreddits}
        />
        {(hasNextPage || isFetching) && (
          <div className="subreddit-search__more-btn">
            <Button
              color="gray"
              pill
              size="sm"
              onClick={() => {
                if (!isFetching) fetchNextPage();
              }}
            >
              {isFetching ? <Skeleton width={80} /> : "Show more"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
