import React, { useState, useEffect, useContext } from "react";
import {
  Post as PostType,
  CommentThread,
  CommentsSortingMethod,
  User,
  MoreItems,
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
  const [moreThread, setMoreThread] = useState<MoreItems>({
    totalCount: 0,
    ids: [],
  });
  const [commentsSorting, setCommentsSorting] =
    useState<CommentsSortingMethod>("confidence");
  const [users, setUsers] = useState<Record<string, User>>({});
  const [collapsedThreadIds, setCollapsedThreadIds] = useState<string[]>([]);
  const client = useContext(ClientContext);
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];

  const loadMoreReplies = async (path: string[], threadIds: string[]) => {
    const { threads: newThreads, more } = await client.getMoreComments(
      postId, threadIds, { sort: commentsSorting }
    );
    if (path.length == 0) {
      setCommentThreads((threads) => [...threads, ...newThreads]);
      setMoreThread(more);
    } else {
      setCommentThreads((threads) =>
        updateThread(threads, path, (thread) => ({
          replies: {
            threads: [...thread.replies.threads, ...newThreads],
            more,
          }
        }))
      );
    }
  };

  const updateThread = (
    threads: CommentThread[],
    path: string[],
    updater: (thread: CommentThread) => Partial<CommentThread>,
  ) => {
    const threadId = path[0];
    const threadIndex = threads
      .findIndex(({ comment }) => comment.id == threadId);
    const thread = { ...threads[threadIndex] };

    if (path.length == 1) {
      Object.assign(thread, updater(thread));
    } else {
      thread.replies.threads =
        updateThread(thread.replies.threads, path.slice(1), updater);
    }

    threads = [...threads];
    threads[threadIndex] = thread;

    return threads;
  }

  const handleThreadCollapseToggle = (id: string) => {
    setCollapsedThreadIds((ids) => {
      const newIds = [...ids];
      const i = ids.indexOf(id);
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
      setMoreThread(more);
    })();
  }, [commentsSorting]);

  useEffect(() => {
    (async () => {
      if (commentThreads.length == 0) return;

      const newUserIds = new Set<string>();

      (function traverseTreads(threads) {
        for (const thread of threads) {
          const { comment } = thread;
          if (comment.userId && !(comment.userId in users)) {
            newUserIds.add(comment.userId);
          }
          traverseTreads(thread.replies.threads);
        }
      })(commentThreads);

      if (newUserIds.size == 0) return;

      const newUsers = (await client.getUsers([...newUserIds.values()]))
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
            <div className="comments">
              <Card>
                <CommentThreadList
                  collapsedThreadIds={collapsedThreadIds}
                  more={moreThread}
                  threads={commentThreads}
                  users={users}
                  onThreadCollapseToggle={handleThreadCollapseToggle}
                  onThreadLoadMore={loadMoreReplies}
                />
              </Card>
            </div>
            {moreThread.ids.length > 0 && (
              <IntersectionDetector
                marginTop={100}
                onIntersect={() => loadMoreReplies([], moreThread.ids)}
              />
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
