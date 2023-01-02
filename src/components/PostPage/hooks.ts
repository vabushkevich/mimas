import { useState, useEffect, useContext, useCallback } from "react";
import { updateThread } from "@utils";
import {
  CommentSortingMethod,
  CommentThreadList,
} from "@types";
import { ClientContext } from "@context";

export function useComments(
  postId: string,
  commentsSorting: CommentSortingMethod,
) {
  const [commentThreadList, setCommentThreadList] =
    useState<CommentThreadList>();
  const client = useContext(ClientContext);

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

  const handleLoadMoreComments = useCallback((
    commentIds: string[],
    path?: string[],
  ) => {
    const isDeepComment = path?.length >= 10;
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
    loadComments();
  }, [commentsSorting]);

  return {
    commentThreadList,
    handleLoadMoreComments,
    handleThreadToggle,
  };
}
