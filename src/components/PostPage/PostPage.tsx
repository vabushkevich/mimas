import React, { useState, useEffect, useContext, useCallback } from "react";
import { updateThread, traverseThreads } from "@utils";
import {
  Post as PostType,
  CommentSortingMethod,
  User,
  CommentThreadList as CommentThreadListType,
} from "@types";
import { ClientContext, UsersContext } from "@context";

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
  const client = useContext(ClientContext);
  const postId = "t3_" + location.pathname.match(/\/comments\/(\w+)\//)[1];

  const loadComments = async (path?: string[]) => {
    const newThreadList = await client.getComments(
      postId,
      {
        commentId: path?.at(-1),
        sort: commentsSorting,
      }
    );

    setCommentThreadList((threadList) => {
      if (!path) return newThreadList;
      return updateThread(threadList, path, () => ({
        replies: newThreadList.threads[0].replies,
      }));
    });
  };

  const loadMoreComments = async (commentIds: string[], path?: string[]) => {
    const {
      threads: loadedThreads,
      more: newMore,
    } = await client.getMoreComments(
      postId,
      commentIds,
      { sort: commentsSorting },
    );

    setCommentThreadList((threadList) => {
      if (!path) return {
        threads: [...threadList.threads, ...loadedThreads],
        more: newMore,
      };

      return updateThread(threadList, path, (thread) => ({
        replies: {
          threads: [...thread.replies.threads, ...loadedThreads],
          more: newMore,
        }
      }));
    });
  };

  const handleThreadLoadMore = useCallback((
    commentIds: string[],
    path: string[],
  ) => {
    const isDeepComment = path.length >= 10;
    if (isDeepComment) {
      loadComments(path);
    } else {
      loadMoreComments(commentIds, path);
    }
  }, []);

  const handleThreadToggle = useCallback((path: string[]) => {
    setCommentThreadList((threadList) =>
      updateThread(threadList, path, (thread) => ({
        collapsed: !thread.collapsed,
      }))
    );
  }, []);

  useEffect(() => {
    (async () => {
      const post = (await client.getPosts([postId]))[0];
      setPost(post);
    })();
  }, []);

  useEffect(() => {
    loadComments();
  }, [commentsSorting]);

  useEffect(() => {
    (async () => {
      if (!commentThreadList) return;

      const newUserIds = new Set<string>();

      traverseThreads(commentThreadList, (thread) => {
        const { comment } = thread;
        if (comment.userId && !(comment.userId in users)) {
          newUserIds.add(comment.userId);
        }
      });

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
                <UsersContext.Provider value={users}>
                  <CommentThreadList
                    {...commentThreadList}
                    onThreadLoadMore={handleThreadLoadMore}
                    onThreadToggle={handleThreadToggle}
                  />
                </UsersContext.Provider>
              </Card>
            </div>
            {commentThreadList?.more?.ids.length > 0 && (
              <IntersectionDetector
                marginTop={100}
                onIntersect={() =>
                  loadMoreComments(commentThreadList.more.ids)
                }
              />
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
