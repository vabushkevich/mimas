import React, { useState, useEffect } from "react";

import { PostList, Container } from "@components";

async function loadPosts(ids: string[], accessToken: string) {
  const postsRaw = await fetch(
    `https://oauth.reddit.com/api/info?id=${ids.join()}`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json.data.children);

  return postsRaw.map(({ data }: any) => ({
    commentCount: data.num_comments,
    dateCreated: data.created_utc * 1000,
    id: data.name,
    score: data.score,
    subreddit: data.subreddit,
    title: data.title,
    url: `https://www.reddit.com${data.permalink}`,
    userName: data.author,
  }));
}

export function TestPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      const accessToken = await fetch(
        "https://www.reddit.com/api/v1/access_token",
        {
          method: "POST",
          body: new URLSearchParams([
            ["grant_type", "https://oauth.reddit.com/grants/installed_client"],
            ["device_id", "DO_NOT_TRACK_THIS_DEVICE"],
          ]),
          headers: {
            "Authorization": "Basic CREDENTIALS",
          },
        }
      )
        .then((res) => res.json())
        .then((json) => json.access_token);

      const ids = ["y5quua", "ll758a", "fo7p5b", "y8zot8", "y8iuvs", "y65mmv", "y5qe15", "y8ufdr", "xjyw0a", "y5kht8"];
      const posts = await loadPosts(ids.map((id) => `t3_${id}`), accessToken);

      setPosts(posts);
    })();
  }, []);

  return (
    <Container>
      <PostList posts={posts} />
    </Container>
  );
}
