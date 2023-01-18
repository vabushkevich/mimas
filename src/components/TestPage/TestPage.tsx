import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";
import { createId } from "@utils";
import { Post } from "@types";

import { PostList, Container, Page } from "@components";

export function TestPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
      const ids = ["y5quua", "ll758a", "fo7p5b", "y8zot8", "y8iuvs", "y65mmv", "y5qe15", "y8ufdr", "xjyw0a", "y5kht8"];
      const posts = await client.getPosts(ids.map((id) => createId(id, "post")));

      setPosts(posts);
    })();
  }, []);

  return (
    <Page>
      <Container>
        <PostList posts={posts} />
      </Container>
    </Page>
  );
}
