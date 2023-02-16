import React from "react";
import {
  generatePath,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { isPostSortingMethod, isSortTimeInterval } from "@types";
import { useQueryString } from "@hooks";
import { useSubredditByName } from "@services/api";

import {
  Container,
  Page,
  Feed,
  AuthorHeader,
} from "@components";
import "./SubredditPage.scss";

export function SubredditPage() {
  const params = useParams<{ sort: string }>();
  const postSorting = isPostSortingMethod(params.sort)
    ? params.sort
    : "hot";

  const query = useQueryString<{ t: string }>();
  const sortTimeInterval = isSortTimeInterval(query.t)
    ? query.t
    : "day";

  const { subreddit: subredditName } = useParams<{ subreddit: string }>();
  const { data: subreddit } = useSubredditByName(subredditName);
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <Page>
      <Container>
        {subreddit && (
          <div className="subreddit-page__header">
            <AuthorHeader
              description={subreddit.description}
              name={subreddit.name}
              picture={subreddit.avatar}
              stats={[
                {
                  label: "Members",
                  value: compactNumber(subreddit.subscribers),
                },
                {
                  label: "Online",
                  value: compactNumber(subreddit.activeUserCount),
                },
                {
                  label: "Subreddit Age",
                  title: formatDate(subreddit.dateCreated),
                  value: formatDistanceToNow(subreddit.dateCreated),
                },
              ]}
            />
          </div>
        )}
        <Feed
          removeSubreddit
          sort={postSorting}
          sortTimeInterval={sortTimeInterval}
          subreddit={subredditName}
          onSortChange={(sort) => {
            const pathname = generatePath(match.path, {
              sort,
              subreddit: subredditName,
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
