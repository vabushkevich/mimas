import { useState, useEffect, useContext } from "react";
import { getCommentChildIds, updateComment } from "@utils";
import {
  CommentSortingMethod,
  Comment,
  MoreItems,
  User,
} from "@types";
import { ClientContext } from "@context";

export function useComments(
  postId: string,
  commentsSorting: CommentSortingMethod,
) {
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [moreComments, setMoreComments] = useState<MoreItems>();
  const client = useContext(ClientContext);

  const rootCommentIds = getCommentChildIds(comments, postId);

  const loadComments = async (commentId?: string) => {
    const baseDepth = comments[commentId]?.depth;
    const {
      comments: loadedComments,
      moreComments: newMoreComments,
    } = await client.getComments(
      postId,
      {
        baseDepth,
        commentId,
        sort: commentsSorting,
      }
    );

    if (commentId) {
      const newChildIds = getCommentChildIds(loadedComments, commentId);
      setComments((comments) => ({
        ...updateComment(comments, commentId, () => ({
          childIds: newChildIds,
          moreChildren: newMoreComments,
        })),
        ...loadedComments,
      }));
      return;
    }

    setComments(loadedComments);
    setMoreComments(newMoreComments);
  };

  const loadMoreCommentsShallow = async (commentId?: string) => {
    const commentIds = commentId
      ? comments[commentId].moreChildren.ids
      : moreComments.ids;
    const {
      comments: loadedComments,
      moreComments: newMoreComments,
    } = await client.getMoreComments(
      postId,
      commentIds,
      { sort: commentsSorting },
    );

    if (commentId) {
      const newChildIds = getCommentChildIds(loadedComments, commentId);
      setComments((comments) => ({
        ...updateComment(comments, commentId, (comment) => ({
          childIds: comment.childIds.concat(newChildIds),
          moreChildren: newMoreComments,
        })),
        ...loadedComments,
      }));
      return;
    }

    setComments((comments) => ({ ...comments, ...loadedComments }));
    setMoreComments(newMoreComments);
  };

  const loadMoreComments = (commentId?: string) => {
    const isDeepComment = comments[commentId]?.depth >= 9;
    if (isDeepComment) {
      loadComments(commentId);
    } else {
      loadMoreCommentsShallow(commentId);
    }
  };

  useEffect(() => {
    loadComments();
  }, [commentsSorting]);

  return {
    comments,
    moreComments,
    rootCommentIds,
    loadMoreComments,
  };
}

export function useUsers(comments: Record<string, Comment>) {
  const client = useContext(ClientContext);
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    (async () => {
      const newUserIds = new Set<string>();

      for (const commentId in comments) {
        const { userId } = comments[commentId];
        if (userId && !(userId in users)) newUserIds.add(userId);
      }

      if (newUserIds.size == 0) return;

      const newUsers = (await client.getUsers([...newUserIds.values()]))
        .reduce(
          (res, user) => (res[user.id] = user, res),
          {} as Record<string, User>,
        );

      setUsers((users) => ({ ...users, ...newUsers }));
    })();
  }, [comments]);

  return users;
}