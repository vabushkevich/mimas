import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";

import { PostList, Container, Page } from "@components";

export function TestPage() {
  const [postsData, setPostsData] = useState([]);
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
      const ids = ["y5quua", "ll758a", "fo7p5b", "y8zot8", "y8iuvs", "y65mmv", "y5qe15", "y8ufdr", "xjyw0a", "y5kht8"];
      const postsData = await client.getPosts(ids);

      setPostsData(postsData);
    })();
  }, []);

  return (
    <Page>
      <Container>
        <PostList postsData={postsData} />
      </Container>
    </Page>
  );
}
