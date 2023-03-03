import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth } from "@services/auth";

import {
  PostPage,
  SubredditPage,
  UserPage,
  FeedPage,
  AuthPage,
} from "@components";

export function App() {
  const { authorized } = useAuth();

  return (
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
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/">
          <FeedPage type={authorized ? "user" : "popular"} />
        </Route>
      </Switch>
    </Router>
  );
}
