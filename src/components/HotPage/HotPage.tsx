import React, { useState, useEffect } from "react";
import { PostData } from "@types";

import { PostList, Container } from "@components";

async function loadHotPosts(accessToken: string) {
  const postsRaw: PostData[] = await fetch(
    "https://oauth.reddit.com/hot",
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

export function HotPage() {
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

      const postsData = await loadHotPosts(accessToken);

      setPostsData(postsData);
    })();
  }, []);

  return (
    <Container>
      <PostList postsData={postsData} />
    </Container>
  );
}
