import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";
import { Post } from "@types";

import { PostList, Container, Page, IntersectionDetector } from "@components";

export function SubredditPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const client = useContext(ClientContext);
  const subreddit = location.pathname.match(/\/r\/(\w+)/)[1];

  const loadMorePosts = async (limit?: number) => {
    const newPosts = await client.getFeedPosts({
      after: posts.at(-1)?.id,
      limit,
      subreddit,
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
