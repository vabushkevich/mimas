import React from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useAuthGuard, useFeedParams } from "@hooks";
import { useSubredditByName, useSubscribe } from "@services/api";
import { useAuth } from "@services/auth";

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
  const { authorized } = useAuth();
  const { author, sort, sortTimeInterval } = useFeedParams();
  const subredditName = author == "" && !authorized ? "all" : author;
  const headless = ["", "all", "popular"].includes(subredditName);

  const { data: subreddit, isLoading } = useSubredditByName(subredditName, {
    enabled: !headless,
  });
  const history = useHistory();
  const match = useRouteMatch();

  const { mutate: mutateSubscription } = useSubscribe(subredditName);
  const subscribe = useAuthGuard(mutateSubscription);

  return (
    <Page title={subredditName}>
      <Container>
        {!headless && (
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
        )}
        {(!subreddit?.private || headless) && (
          <Feed
            enableBestSort={subredditName == ""}
            primaryAuthorType={headless ? "subreddit" : "user"}
            sort={sort}
            sortTimeInterval={sortTimeInterval}
            subreddit={subredditName}
            type={headless ? "mixed" : "subreddit"}
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
