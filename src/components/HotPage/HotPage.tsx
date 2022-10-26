import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";

import { PostList, Container } from "@components";

export function HotPage() {
  const [postsData, setPostsData] = useState([]);
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
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
