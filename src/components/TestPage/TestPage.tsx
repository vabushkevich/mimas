import React, { useState, useEffect } from "react";
import { PostData } from "@types";

import { PostList, Container } from "@components";

async function loadPosts(ids: string[], accessToken: string) {
  const postsRaw: PostData[] = await fetch(
    `https://oauth.reddit.com/api/info?id=${ids.join()}`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json.data.children.map((post: any) => post.data));

  return postsRaw;
}

export function TestPage() {
  const [postsData, setPostsData] = useState([]);
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
      const postsData = await loadPosts(ids.map((id) => `t3_${id}`), accessToken);

      setPostsData(postsData);
    })();
  }, []);

  return (
    <Container>
      <PostList postsData={postsData} />
    </Container>
  );
}
