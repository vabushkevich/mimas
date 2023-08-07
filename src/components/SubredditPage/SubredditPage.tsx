import React from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useAuthGuard, useFeedParams } from "@hooks";
import { useSubredditByName, useSubscribe } from "@services/api";

import {
  Container,
  Page,
  Feed,
  AuthorHeader,
  AuthorHeaderSkeleton,
  SubscribeButton,
} from "@components";
import "./SubredditPage.scss";

export function SubredditPage() {
  const { author: subredditName, sort, sortTimeInterval } = useFeedParams();
  const { data: subreddit, isLoading } = useSubredditByName(subredditName);
  const history = useHistory();
  const match = useRouteMatch();

  const { mutate: mutateSubscription } = useSubscribe(subredditName);
  const subscribe = useAuthGuard(mutateSubscription);

  return (
    <Page title={subredditName}>
      <Container>
        <div className="subreddit-page__header">
          {isLoading && (
            <AuthorHeaderSkeleton showDescription showSubscribeButton />
          )}
          {subreddit &&
            (subreddit.private ? (
              <AuthorHeader
                description={`Moderators of r/${subreddit.name} have set this subreddit as private.`}
                name={subreddit.name}
              />
            ) : (
              <AuthorHeader
                avatar={subreddit.avatar}
                description={subreddit.description}
                name={subreddit.name}
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
                subscribeButton={
                  <SubscribeButton
                    subscribed={subreddit.subscribed}
                    onClick={() =>
                      subscribe(subreddit.subscribed ? "unsub" : "sub")
                    }
                  />
                }
              />
            ))}
        </div>
        {!subreddit?.private && (
          <Feed
            primaryAuthorType="user"
            sort={sort}
            sortTimeInterval={sortTimeInterval}
            subreddit={subredditName}
            type="subreddit"
            unmarkPinned={sort != "hot"}
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
        )}
      </Container>
    </Page>
  );
}
