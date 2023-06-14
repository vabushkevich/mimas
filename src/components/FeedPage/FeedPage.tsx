import React from "react";
import {
  generatePath,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { FeedPageType, isPostSortingMethod, isSortTimeInterval } from "@types";
import { useQueryString } from "@hooks";

import { Container, Page, Feed } from "@components";

type FeedPageProps = {
  type: FeedPageType;
};

export function FeedPage({ type }: FeedPageProps) {
  const params = useParams<{ sort: string }>();
  const postSorting = isPostSortingMethod(params.sort) ? params.sort : "hot";

  const query = useQueryString<{ t: string }>();
  const sortTimeInterval = isSortTimeInterval(query.t) ? query.t : "day";

  const history = useHistory();
  const match = useRouteMatch();
  const subreddit = type == "user" ? "" : type;

  return (
    <Page>
      <Container>
        <Feed
          sort={postSorting}
          sortTimeInterval={sortTimeInterval}
          subreddit={subreddit}
          type="mixed"
          unmarkPinned
          onSortChange={(sort) => {
            const pathname = generatePath(match.path, { sort });
            history.replace({ pathname });
          }}
          onSortTimeIntervalChange={(sortTimeInterval) => {
            history.replace({ search: `?t=${sortTimeInterval}` });
          }}
        />
      </Container>
    </Page>
  );
}
