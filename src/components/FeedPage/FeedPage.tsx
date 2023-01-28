import React from "react";
import { FeedPageType } from "@types";

import {
  Container,
  Page,
  Feed,
} from "@components";

type FeedPageProps = {
  type: FeedPageType;
};

export function FeedPage({ type }: FeedPageProps) {
  const subreddit = type == "user" ? "" : type;

  return (
    <Page>
      <Container>
        <Feed subreddit={subreddit} />
      </Container>
    </Page>
  );
}
