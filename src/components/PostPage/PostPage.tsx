import React, { useState, useEffect } from "react";
import { PostData } from "@types";
import { getAccessToken } from "@services/authorization";
import { RedditWebAPI } from "@services/reddit-web-api";

import { Post, Container } from "@components";

export function PostPage() {
  const [postData, setPostData] = useState<PostData>();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const client = new RedditWebAPI(accessToken);
      const postId = location.pathname.match(/\/comments\/(\w+)\//)[1];
      const postData = (await client.getPosts([postId]))[0];

      setPostData(postData);
    })();
  }, []);

  return (
    <Container>
      {postData ? <Post postData={postData} /> : <div>Loading...</div>}
    </Container>
  );
}
