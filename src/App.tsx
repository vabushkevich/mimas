import React, { useState, useEffect } from "react";

import { PostPreview } from "@components";

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

      const posts = await fetch(
        "https://oauth.reddit.com/r/AskReddit/hot?limit=5",
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => json.data.children);

      setPosts(posts);
    })();
  }, []);

  return (
    <ol>
      {posts.map((post) => (
        <li key={post.data.name}>
          <PostPreview
            commentCount={post.data.num_comments}
            dateCreated={post.data.created_utc * 1000}
            score={post.data.score}
            title={post.data.title}
            userName={post.data.author}
          />
        </li>
      ))}
    </ol>
  );
}
