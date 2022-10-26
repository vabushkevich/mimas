import React, { useState, useEffect } from "react";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/reddit-web-api";

import { PostList, Container } from "@components";

export function HotPage() {
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const client = new RedditWebAPI(accessToken);
      const postsData = await client.getHotPosts();

      setPostsData(postsData);
    })();
  }, []);

  return (
    <Container>
      <PostList postsData={postsData} />
    </Container>
  );
}
