import React from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import { useFeedParams } from "@hooks";
import { useAuth } from "@services/auth";

import { Container, Page, Feed } from "@components";

export function FeedPage() {
  const { authorized } = useAuth();
  const { author, sort, sortTimeInterval } = useFeedParams();
  const history = useHistory();
  const match = useRouteMatch();
  const subreddit = author == "" && !authorized ? "all" : author;

  return (
    <Page>
      <Container>
        <Feed
          enableBestSort={subreddit == ""}
          hidePins
          sort={sort}
          sortTimeInterval={sortTimeInterval}
          subreddit={subreddit}
          type="mixed"
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
