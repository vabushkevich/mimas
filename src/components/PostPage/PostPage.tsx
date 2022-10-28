import React, { useState, useEffect, useContext } from "react";
import { PostData, CommentThreadData } from "@types";
import { ClientContext } from "@context";

import { Post, Container, Page, CommentThreadList } from "@components";

export function PostPage() {
  const [postData, setPostData] = useState<PostData>();
  const [commentThreadsData, setCommentThreadsData] = useState<CommentThreadData[]>();
  const [nextThreadsIds, setNextThreadsIds] = useState<string[]>([]);
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
      const postId = location.pathname.match(/\/comments\/(\w+)\//)[1];
      const postData = (await client.getPosts([postId]))[0];
      const threads = await client.getComments(postId);
      const commentThreadsData = threads.filter(
        (item): item is CommentThreadData => !("children" in item)
      );
      const lastThread = threads.at(-1);

      if (lastThread && "children" in lastThread) {
        setNextThreadsIds([...lastThread.children]);
      }

      setPostData(postData);
      setCommentThreadsData(commentThreadsData);
    })();
  }, []);

  return (
    <Page>
      <Container>
        {postData ? <Post postData={postData} collapsed={false} /> : <div>Loading...</div>}
        {commentThreadsData && <CommentThreadList commentThreadsData={commentThreadsData} />}
      </Container>
    </Page>
  );
}
