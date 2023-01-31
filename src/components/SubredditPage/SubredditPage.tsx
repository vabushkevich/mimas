import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { Subreddit } from "@types";
import { ClientContext } from "@context";

import {
  Container,
  Page,
  Feed,
  AuthorHeader,
} from "@components";
import "./SubredditPage.scss";

export function SubredditPage() {
  const [subreddit, setSubreddit] = useState<Subreddit>();
  const client = useContext(ClientContext);
  const { subreddit: subredditName } = useParams<{ subreddit: string }>();

  useEffect(() => {
    (async () => {
      const subreddit = await client.getSubredditByName(subredditName);
      setSubreddit(subreddit);
    })();
  }, [subredditName]);

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
        <Feed subreddit={subredditName} removeSubreddit />
      </Container>
    </Page>
  );
}
