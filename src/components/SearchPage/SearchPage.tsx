import React from "react";
import { useSearchParams } from "@hooks";

import { Container, Info, Page } from "@components";
import { SubredditSearch } from "./SubredditSearch";
import { PostSearch } from "./PostSearch";
import "./SearchPage.scss";

export function SearchPage() {
  const [{ q: searchQuery }] = useSearchParams<{ q?: string }>();

  if (!searchQuery) {
    return (
      <Page>
        <Container>
          <Info>Search query is empty</Info>
        </Container>
      </Page>
    );
  }

  return (
    <Page title={`${searchQuery} - Search results`}>
      <Container>
        <div className="search-page__subreddits">
          <SubredditSearch query={searchQuery} />
        </div>
        <div className="search-page__posts">
          <PostSearch query={searchQuery} />
        </div>
      </Container>
    </Page>
  );
}
