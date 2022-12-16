import React, { useState, useEffect } from "react";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/api";
import { ClientContext } from "@context";

import { TestPage, HotPage, PostPage } from "@components";

function isPostPage() {
  return /\/comments\/\w+\//.test(location.pathname);
}

export function App() {
  const SpecificPage = isPostPage() ? PostPage : {
    "/": TestPage,
    "/hot": HotPage,
  }[window.location.pathname];
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
