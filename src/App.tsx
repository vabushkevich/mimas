import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { postFeedSortingOptions } from "@types";

import { AuthPage } from "./components/AuthPage/AuthPage";
import { NotFoundPage } from "./components/NotFoundPage/NotFoundPage";
import { PostPage } from "./components/PostPage/PostPage";
import { SearchPage } from "./components/SearchPage/SearchPage";
import { SubredditPage } from "./components/SubredditPage/SubredditPage";
import { Toaster } from "./components/Toaster/Toaster";
import { UserPage } from "./components/UserPage/UserPage";

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
          <Route path="/r/:subreddit/comments/:id/:slug?/:commentId?">
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
