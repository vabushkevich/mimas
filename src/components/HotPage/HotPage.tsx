import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";

import { PostList, Container, Page, IntersectionDetector } from "@components";

export function HotPage() {
  const [posts, setPosts] = useState([]);
  const client = useContext(ClientContext);

  const loadMorePosts = async (limit?: number) => {
    const newPosts = await client.getHotPosts({
      after: posts.at(-1)?.id,
      limit,
    });
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    loadMorePosts(5);
  }, []);

  return (
    <Page>
      <Container>
        <PostList posts={posts} />
        {posts.length > 0 && (
          <IntersectionDetector
            marginTop={100}
            onIntersect={() => loadMorePosts(5)}
          />
        )}
      </Container>
    </Page>
  );
}
