import React, { useState, useEffect, useContext } from "react";
import {
  Post as PostType,
  CommentThread,
  CommentSortingMethod,
  User,
  CommentThreadList as CommentThreadListType,
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
  value: CommentSortingMethod;
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
  const [commentThreadList, setCommentThreadList] =
    useState<CommentThreadListType>();
  const [commentsSorting, setCommentsSorting] =
    useState<CommentSortingMethod>("confidence");
  const [users, setUsers] = useState<Record<string, User>>({});
  const [collapsedThreadIds, setCollapsedThreadIds] = useState<string[]>([]);
  const client = useContext(ClientContext);
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];

  const loadMoreReplies = async (path: string[], threadIds: string[]) => {
    const isDeepReplies = path.length >= 10;
    const { threads: loadedThreads, more: newMore } = isDeepReplies
      ? (
        await client.getComments(
          postId,
          {
            rootCommentId: path.at(-1),
            excludeRootComment: true,
            sort: commentsSorting,
          }
        )
      ) : (
        await client.getMoreComments(
          postId,
          threadIds,
          { sort: commentsSorting },
        )
      );

    setCommentThreadList((threadList) => {
      if (path.length == 0) return {
        threads: [...threadList.threads, ...loadedThreads],
        more: newMore,
      };

      return updateThread(threadList, path, (thread) => ({
        replies: {
          threads: isDeepReplies
            ? loadedThreads
            : [...thread.replies.threads, ...loadedThreads],
          more: newMore,
        }
      }));
    });
  };

  const updateThread = (
    threadList: CommentThreadListType,
    path: string[],
    updater: (thread: CommentThread) => Partial<CommentThread>,
  ) => {
    const threads = [...threadList.threads];
    const threadId = path[0];
    const threadIndex = threads
      .findIndex(({ comment }) => comment.id == threadId);
    const thread = { ...threads[threadIndex] };

    if (path.length == 1) {
      Object.assign(thread, updater(thread));
    } else {
      thread.replies = updateThread(thread.replies, path.slice(1), updater);
    }

    threads[threadIndex] = thread;
    threadList = { ...threadList, threads };

    return threadList;
  }

  const handleThreadToggle = (id: string) => {
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
      const threadList = await client.getComments(
        postId,
        { sort: commentsSorting },
      );
      setCommentThreadList(threadList);
    })();
  }, [commentsSorting]);

  useEffect(() => {
    (async () => {
      if (!commentThreadList) return;

      const newUserIds = new Set<string>();

      (function traverseTreads(threadList) {
        for (const thread of threadList.threads) {
          const { comment } = thread;
          if (comment.userId && !(comment.userId in users)) {
            newUserIds.add(comment.userId);
          }
          traverseTreads(thread.replies);
        }
      })(commentThreadList);

      if (newUserIds.size == 0) return;

      const newUsers = (await client.getUsers([...newUserIds.values()]))
        .reduce(
          (res, user) => (res[user.id] = user, res),
          {} as Record<string, User>,
        );
      setUsers((users) => ({ ...users, ...newUsers }));
    })();
  }, [commentThreadList]);

  return (
    <Page>
      <Container>
        {post ? <Post {...post} collapsed={false} /> : <div>Loading...</div>}
        {commentThreadList?.threads.length > 0 && (
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
                  {...commentThreadList}
                  collapsedThreadIds={collapsedThreadIds}
                  users={users}
                  onThreadLoadMore={loadMoreReplies}
                  onThreadToggle={handleThreadToggle}
                />
              </Card>
            </div>
            {commentThreadList?.more?.ids.length > 0 && (
              <IntersectionDetector
                marginTop={100}
                onIntersect={() =>
                  loadMoreReplies([], commentThreadList.more.ids)
                }
              />
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
