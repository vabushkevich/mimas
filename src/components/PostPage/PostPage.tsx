import React, { useState, useEffect, useContext } from "react";
import {
  Post as PostType,
  CommentThread,
  CommentsSortingMethod,
  User,
} from "@types";
import { ClientContext } from "@context";

import {
  Post,
  Container,
  Page,
  CommentThreadList,
  DropdownMenu,
  MenuItem,
  Card,
} from "@components";
import "./PostPage.scss";

const commentsSortingMenu: {
  text: string;
  value: CommentsSortingMethod;
}[] = [
  { text: "Best", value: "confidence" },
  { text: "Top", value: "top" },
  { text: "New", value: "new" },
  { text: "Controversial", value: "controversial" },
  { text: "Old", value: "old" },
  { text: "Q&A", value: "qa" },
];

export function PostPage() {
  const [post, setPost] = useState<PostType>();
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>([]);
  const [nextThreadIds, setNextThreadIds] = useState<string[]>([]);
  const [commentsSorting, setCommentsSorting] =
    useState<CommentsSortingMethod>("confidence");
  const [users, setUsers] = useState<Record<string, User>>({});
  const client = useContext(ClientContext);
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];

  useEffect(() => {
    (async () => {
      const post = (await client.getPosts([postId]))[0];
      setPost(post);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { threads, more } = await client.getComments(
        postId,
        { sort: commentsSorting },
      );
      setCommentThreads(threads);
      setNextThreadIds(more);
    })();
  }, [commentsSorting]);

  useEffect(() => {
    (async () => {
      if (commentThreads.length == 0) return;

      const userIds = new Set<string>();

      (function traverseTreads(threads) {
        for (const thread of threads) {
          const { comment } = thread;
          if (comment.userId && !(comment.userId in users)) {
            userIds.add(comment.userId);
          }
          traverseTreads(thread.replies);
        }
      })(commentThreads);

      const newUsers = (await client.getUsers([...userIds.values()]))
        .reduce(
          (res, user) => (res[user.id] = user, res),
          {} as Record<string, User>,
        );
      setUsers((users) => ({ ...users, ...newUsers }));
    })();
  }, [commentThreads]);

  return (
    <Page>
      <Container>
        {post ? <Post {...post} collapsed={false} /> : <div>Loading...</div>}
        {commentThreads.length > 0 && (
          <>
            <div className="comments-sorting">
              <Card>
                <DropdownMenu
                  buttonText={commentsSortingMenu
                    .find((item) => item.value == commentsSorting)
                    .text
                  }
                >
                  {commentsSortingMenu.map(({ value, text }) => (
                    <MenuItem
                      key={value}
                      selected={value == commentsSorting}
                      onClick={() => setCommentsSorting(value)}
                    >
                      {text}
                    </MenuItem>
                  ))}
                </DropdownMenu>
              </Card>
            </div>
            <CommentThreadList threads={commentThreads} users={users} />
          </>
        )}
      </Container>
    </Page>
  );
}
