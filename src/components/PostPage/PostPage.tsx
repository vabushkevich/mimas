import React, { useState, useEffect } from "react";
import { PostData } from "@types";

import { Post, Container } from "@components";

async function loadPost(id: string, accessToken: string) {
  const postRaw: PostData = await fetch(
    `https://oauth.reddit.com/comments/${id}`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json[0].data.children[0].data);

  return postRaw;
}

export function PostPage() {
  const [postData, setPostData] = useState<PostData>();
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

      const postId = location.pathname.match(/\/comments\/(\w+)\//)[1];
      const postData = await loadPost(postId, accessToken);

      setPostData(postData);
    })();
  }, []);

  return (
    <Container>
      {postData ? <Post postData={postData} /> : <div>Loading...</div>}
    </Container>
  );
}
