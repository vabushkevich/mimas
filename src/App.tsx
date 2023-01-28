import React, { useState, useEffect } from "react";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/api";
import { ClientContext, AvatarsContextProvider } from "@context";
import { isPostSortingMethod, FeedPageType } from "@types";

import {
  TestPage,
  PostPage,
  SubredditPage,
  UserPage,
  FeedPage,
} from "@components";

function isPostPage() {
  return /\/comments\/\w+\//.test(location.pathname);
}

function isSubredditPage() {
  return /^\/r\/\w+(\/|$)/.test(location.pathname);
}

function isUserPage() {
  return /^\/user\/[\w-]+/.test(location.pathname);
}

function isFeedPage() {
  return !!getFeedPageType(location.href);
}

function getFeedPageType(href: string): FeedPageType {
  const { pathname } = new URL(href);
  const pathParts = pathname.split("/");
  if (pathParts[1] == "" || isPostSortingMethod(pathParts[1])) return "user";
  if (pathParts[2] == "all" || pathParts[2] == "popular") return pathParts[2];
}

function getPage() {
  if (location.pathname == "/") return <TestPage />;
  if (isFeedPage()) return <FeedPage type={getFeedPageType(location.href)} />;
  if (isPostPage()) return <PostPage />;
  if (isUserPage()) return <UserPage />;
  if (isSubredditPage()) return <SubredditPage />;
}

export function App() {
  const [client, setClient] = useState<RedditWebAPI>(null);
  const page = getPage();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const client = new RedditWebAPI(accessToken);

      setClient(client);
    })();
  }, []);

  return client && (
    <ClientContext.Provider value={client}>
      <AvatarsContextProvider>
        {page}
      </AvatarsContextProvider>
    </ClientContext.Provider>
  );
}
