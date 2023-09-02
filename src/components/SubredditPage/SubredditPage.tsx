import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useAuthGuard, useParams, useSearchParams } from "@hooks";
import { useSubredditByName, useSubscribe } from "@services/api";
import { useAuth } from "@services/auth";
import { isPostFeedSortingOption, isSortTimeInterval } from "@types";

import {
  Container,
  Page,
  PostFeed,
  AuthorHeader,
  AuthorHeaderSkeleton,
  SubscribeButton,
} from "@components";
import "./SubredditPage.scss";

export function SubredditPage() {
  const { authorized } = useAuth();
  const [params, setParams] = useParams<{
    subreddit?: string;
    sort?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams<{ t?: string }>();

  const sort = isPostFeedSortingOption(params.sort) ? params.sort : undefined;
  const sortTimeInterval = isSortTimeInterval(searchParams.t)
    ? searchParams.t
    : undefined;

  const subredditName = params.subreddit || (authorized ? "" : "all");
  const headless = ["", "all", "popular"].includes(subredditName);

  const { data: subreddit, isLoading } = useSubredditByName(subredditName, {
    enabled: !headless,
  });

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
          <PostFeed
            sort={sort}
            sortTimeInterval={sortTimeInterval}
            subreddit={subredditName}
            type={headless ? "mixed" : "subreddit"}
            onSortChange={(sort) => {
              setParams({ ...params, sort });
            }}
            onSortTimeIntervalChange={(sortTimeInterval) => {
              setSearchParams({ t: sortTimeInterval });
            }}
          />
        )}
      </Container>
    </Page>
  );
}
