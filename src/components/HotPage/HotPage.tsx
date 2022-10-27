import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";

import { PostList, Container, Page, IntersectionDetector } from "@components";

export function HotPage() {
  const [postsData, setPostsData] = useState([]);
  const client = useContext(ClientContext);

  const loadMorePosts = async (limit?: number) => {
    const newPostsData = await client.getHotPosts({
      after: postsData.at(-1)?.name,
      limit,
    });
    setPostsData((postsData) => [...postsData, ...newPostsData]);
  };

  useEffect(() => {
    loadMorePosts(5);
  }, []);

  return (
    <Page>
      <Container>
        <PostList postsData={postsData} />
        {postsData.length > 0 && (
          <IntersectionDetector
            marginTop={100}
            onIntersect={() => loadMorePosts(5)}
          />
        )}
      </Container>
    </Page>
  );
}
