import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Toaster } from "@components";
import { postSortingOptions } from "@types";

import {
  PostPage,
  SubredditPage,
  UserPage,
  FeedPage,
  AuthPage,
} from "@components";

const sortParamValues = postSortingOptions.join("|");

export function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path={[
              `/:sort(${sortParamValues})?`,
              `/r/:subreddit(all|popular)/:sort(${sortParamValues})?`,
            ]}
          >
            <FeedPage />
          </Route>
          <Route exact path={`/r/:subreddit/:sort(${sortParamValues})?`}>
            <SubredditPage />
          </Route>
          <Route path={["/user/:name", "/u/:name"]}>
            <UserPage />
          </Route>
          <Route path="/r/:subreddit/comments/:id">
            <PostPage />
          </Route>
          <Route path="/auth">
            <AuthPage />
          </Route>
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}
