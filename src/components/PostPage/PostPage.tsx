import React, { useState, useEffect, useContext } from "react";
import { PostData } from "@types";
import { ClientContext } from "@context";

import { Post, Container, Page } from "@components";

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
    <Page>
      <Container>
        {postData ? <Post postData={postData} collapsed={false} /> : <div>Loading...</div>}
      </Container>
    </Page>
  );
}
