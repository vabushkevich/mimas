import React, { useState, useEffect } from "react";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/reddit-web-api";

import { PostList, Container } from "@components";

export function TestPage() {
  const [postsData, setPostsData] = useState([]);
  
  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const client = new RedditWebAPI(accessToken);
      const ids = ["y5quua", "ll758a", "fo7p5b", "y8zot8", "y8iuvs", "y65mmv", "y5qe15", "y8ufdr", "xjyw0a", "y5kht8"];
      const postsData = await client.getPosts(ids);

      setPostsData(postsData);
    })();
  }, []);

  return (
    <Container>
      <PostList postsData={postsData} />
    </Container>
  );
}
