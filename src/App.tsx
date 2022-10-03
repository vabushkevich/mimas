import React, { useState, useEffect } from "react";

import { PostPreview } from "@components";

export function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(
      "https://oauth.reddit.com/r/AskReddit/hot?limit=5",
      {
        headers: {
          "Authorization": "Bearer CREDENTIALS",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => setPosts(json.data.children));
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
