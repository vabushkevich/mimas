import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { postFeedSortingOptions } from "@types";

import {
  AuthPage,
  NotFoundPage,
  PostPage,
  SearchPage,
  SubredditPage,
  Toaster,
  UserPage,
} from "@components";

const sortParamValues = postFeedSortingOptions.join("|");

export function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path={[
              `/:sort(${sortParamValues})?`,
              `/r/:subreddit/:sort(${sortParamValues})?`,
            ]}
          >
            <SubredditPage />
          </Route>
          <Route path="/(user|u)/:name">
            <UserPage />
          </Route>
          <Route path="/r/:subreddit/comments/:id">
            <PostPage />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Route path="/auth">
            <AuthPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}
