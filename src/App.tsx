import React, { useState, useEffect } from "react";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/api";
import { ClientContext } from "@context";

import {
  TestPage,
  HotPage,
  PostPage,
  SubredditPage,
  UserPage,
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

export function App() {
  const SpecificPage = (() => {
    if (isPostPage()) return PostPage;
    if (isUserPage()) return UserPage;
    if (isSubredditPage()) return SubredditPage;
    switch (window.location.pathname) {
      case "/": return TestPage;
      case "/hot": return HotPage;
    }
  })();

  const [client, setClient] = useState<RedditWebAPI>(null);

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const client = new RedditWebAPI(accessToken);

      setClient(client);
    })();
  }, []);

  return client && (
    <ClientContext.Provider value={client}>
      <SpecificPage />
    </ClientContext.Provider>
  );
}
