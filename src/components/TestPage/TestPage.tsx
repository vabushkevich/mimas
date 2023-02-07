import React from "react";
import { createId } from "@utils";
import { usePosts } from "@services/api";

import { PostList, Container, Page } from "@components";

const postIds = ["y5quua", "ll758a", "fo7p5b", "y8zot8", "y8iuvs", "y65mmv", "y5qe15", "y8ufdr", "xjyw0a", "y5kht8"]
  .map((id) => createId(id, "post"));

export function TestPage() {
  const { data: posts } = usePosts(postIds);

  return (
    <Page>
      <Container>
        <PostList posts={posts} />
      </Container>
    </Page>
  );
}
