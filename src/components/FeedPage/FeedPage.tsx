import React from "react";
import {
  generatePath,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { isPostSortingMethod, isSortTimeInterval } from "@types";
import { useQueryString } from "@hooks";
import { useAuth } from "@services/auth";

import { Container, Page, Feed } from "@components";

export function FeedPage() {
  const params = useParams<{ sort: string }>();
  const postSorting = isPostSortingMethod(params.sort) ? params.sort : "hot";

  const query = useQueryString<{ t: string }>();
  const sortTimeInterval = isSortTimeInterval(query.t) ? query.t : "day";

  const { authorized } = useAuth();
  const defaultSubreddit = authorized ? "" : "all";
  const { subreddit = defaultSubreddit } = useParams<{ subreddit?: string }>();
  const history = useHistory();
  const match = useRouteMatch();

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
            const pathname = generatePath(match.path, {
              sort,
              subreddit,
            });
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
