import React, { useState, useEffect, useContext } from "react";
import { PostData } from "@types";
import { ClientContext } from "@context";

import { Post, Container } from "@components";

export function PostPage() {
  const [postData, setPostData] = useState<PostData>();
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
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
