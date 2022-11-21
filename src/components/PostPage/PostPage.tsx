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
  IntersectionDetector,
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
  const [collapsedThreadIds, setCollapsedThreadIds] = useState<string[]>([]);
  const client = useContext(ClientContext);
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];

  const loadMoreThreads = async () => {
    const { threads: newThreads, more } = await client.getMoreComments(
      postId, nextThreadIds, { sort: commentsSorting }
    );
    setCommentThreads((threads) => [...threads, ...newThreads]);
    setNextThreadIds(more);
  };

  const loadMoreReplies = async (path: string[], threadIds: string[]) => {
    const { threads: newThreads, more } = await client.getMoreComments(
      postId, threadIds, { sort: commentsSorting }
    );
    setCommentThreads((threads) =>
      updateThread(threads, path, { replies: newThreads, moreReplies: more })
    );
  };

  const updateThread = (
    threads: CommentThread[],
    path: string[],
    update: Partial<CommentThread>
  ) => {
    const threadId = path[0];
    const threadIndex = threads
      .findIndex(({ comment }) => comment.id == threadId);
    const thread = { ...threads[threadIndex] };

    if (path.length == 1) {
      Object.assign(thread, {
        replies: [...thread.replies, ...update.replies],
        moreReplies: update.moreReplies,
      });
    } else {
      thread.replies = updateThread(thread.replies, path.slice(1), update);
    }

    threads = [...threads];
    threads[threadIndex] = thread;

    return threads;
  }

  const handleThreadCollapseToggle = (id: string) => {
    setCollapsedThreadIds((ids) => {
      const newIds = [...ids];
      const i = collapsedThreadIds.indexOf(id);
      if (i == -1) {
        newIds.push(id);
      } else {
        newIds.splice(i, 1);
      }
      return newIds;
    });
  };

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
            <CommentThreadList
              collapsedThreadIds={collapsedThreadIds}
              threads={commentThreads}
              users={users}
              onThreadCollapseToggle={handleThreadCollapseToggle}
              onThreadLoadMore={loadMoreReplies}
            />
            {nextThreadIds.length > 0 && (
              <IntersectionDetector
                marginTop={100}
                onIntersect={loadMoreThreads}
              />
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
