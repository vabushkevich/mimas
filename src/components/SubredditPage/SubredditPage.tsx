import React from "react";
import { useParams } from "react-router-dom";

import {
  Container,
  Page,
  Feed,
} from "@components";

export function SubredditPage() {
  const { subreddit } = useParams<{ subreddit: string }>();

  return (
    <Page>
      <Container>
        <Feed subreddit={subreddit} removeSubreddit />
      </Container>
    </Page>
  );
}
