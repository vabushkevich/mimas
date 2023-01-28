import React from "react";

import {
  Container,
  Page,
  Feed,
} from "@components";

export function SubredditPage() {
  const subreddit = location.pathname.match(/\/r\/(\w+)/)[1];

  return (
    <Page>
      <Container>
        <Feed subreddit={subreddit} removeSubreddit />
      </Container>
    </Page>
  );
}
