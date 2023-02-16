import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";

import {
  TestPage,
  PostPage,
  SubredditPage,
  UserPage,
  FeedPage,
} from "@components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/r/popular/:sort?">
            <FeedPage type="popular" />
          </Route>
          <Route path="/r/all/:sort?">
            <FeedPage type="all" />
          </Route>
          <Route path="/r/:subreddit/comments/:id">
            <PostPage />
          </Route>
          <Route path="/r/:subreddit/:sort?">
            <SubredditPage />
          </Route>
          <Route path="/user/:name">
            <UserPage />
          </Route>
          <Route path="/">
            <TestPage />
          </Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}
