import React, { useState, useEffect, useContext } from "react";
import { Post as PostType, CommentThread } from "@types";
import { ClientContext } from "@context";

import { Post, Container, Page, CommentThreadList } from "@components";

export function PostPage() {
  const [post, setPost] = useState<PostType>();
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>();
  const [nextThreadsIds, setNextThreadsIds] = useState<string[]>([]);
  const client = useContext(ClientContext);

  useEffect(() => {
    (async () => {
      const postId = location.pathname.match(/\/comments\/(\w+)\//)[1];
      const post = (await client.getPosts([postId]))[0];
      const { threads, more } = await client.getComments(postId);

      setPost(post);
      setCommentThreads(threads);
      setNextThreadsIds(more);
    })();
  }, []);

  return (
    <Page>
      <Container>
        {post ? <Post {...post} collapsed={false} /> : <div>Loading...</div>}
        {commentThreads && <CommentThreadList threads={commentThreads} />}
      </Container>
    </Page>
  );
}
