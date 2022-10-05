import React, { useState, useEffect } from "react";

import { PostList, Container } from "@components";

export function App() {
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

      const postsRaw = await fetch(
        "https://oauth.reddit.com/r/AskReddit/hot?limit=5",
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => json.data.children);

      const posts = postsRaw.map((postRaw: any) => ({
        commentCount: postRaw.data.num_comments,
        dateCreated: postRaw.data.created_utc * 1000,
        id: postRaw.data.name,
        score: postRaw.data.score,
        subreddit: postRaw.data.subreddit,
        title: postRaw.data.title,
        userName: postRaw.data.author,
      }));

      setPosts(posts);
    })();
  }, []);

  return (
    <Container>
      <PostList posts={posts} />
    </Container>
  );
}
