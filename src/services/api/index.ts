import { useCallback } from "react";
import {
  CommentSortingMethod,
  PostSortingMethod,
  SortTimeInterval,
  CommentThreadList,
  Submission,
  Post,
  VoteDirection,
  Comment,
} from "@types";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  useMutation,
  InfiniteData,
} from "react-query";
import { usePostParams } from "@hooks";
import produce from "immer";
import { getSubmissionAuthorIds } from "@utils";
import { queryClient } from "@services/query-client";
import { client } from "./client";

export function usePosts(ids: string[]) {
  return useQuery(
    ["posts", ...ids],
    () => client.getPosts(ids),
    {
      enabled: ids.length > 0,
      placeholderData: [],
    }
  );
}

export function usePost(id: string) {
  return useQuery(["post", id], async () => {
    const post = await client.getPost(id);
    prefetchAvatars([post]);
    return post;
  });
}

export function useFeedPosts(options: {
  limit?: number;
  sort?: PostSortingMethod;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  userName?: string;
}) {
  const {
    limit,
    sort,
    sortTimeInterval,
    subreddit,
    userName,
  } = options;

  return useInfiniteQuery(
    ["post-feed", subreddit ?? userName, limit, sort, sortTimeInterval],
    async ({ pageParam }) => {
      const posts = await client.getFeedPosts({
        ...options,
        after: pageParam,
      });
      prefetchAvatars(posts);
      return posts;
    },
    {
      cacheTime: 0,
      getNextPageParam: ((lastPosts) => lastPosts.at(-1)?.id),
      placeholderData: { pages: [], pageParams: [] },
    }
  );
}

export function useSubredditByName(name: string) {
  return useQuery(["subreddit", name], () => client.getSubredditByName(name));
}

export function useUserByName(name: string) {
  return useQuery(["user", name], () => client.getUserByName(name));
}

export function usePostComments(
  postId: string,
  {
    limit,
    sort,
  }: {
    limit?: number;
    sort?: CommentSortingMethod;
  } = {},
) {
  return useQuery({
    queryKey: ["post-comments", postId, { limit, sort }],
    queryFn: async () => {
      const threadList = await client.getComments(postId, { limit, sort });
      prefetchAvatars(Object.values(threadList.comments));
      return threadList;
    },
    cacheTime: 0,
  });
}

export function useComment(id: string) {
  const queryClient = useQueryClient();

  const getComment = useCallback(() => {
    const comments = queryClient.getQueryData<CommentThreadList>(
      ["post-comments"],
      {
        active: true,
        exact: false,
      },
    );
    const comment = comments.comments[id];
    return comment;
  }, [id]);

  return useQuery({
    queryKey: ["comments", "detail", id],
    initialData: getComment,
    queryFn: getComment,
    cacheTime: 0,
  });
}

export function useLoadMoreComments(
  {
    commentId,
    limit,
  }: {
    commentId?: string
    limit?: number;
  } = {},
) {
  const { postId, sort } = usePostParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const comments = queryClient.getQueryData<CommentThreadList>(
        ["post-comments"],
        { active: true, exact: false },
      );
      const commentIds = commentId
        ? comments.comments[commentId]?.moreChildren.ids
        : comments?.moreComments.ids;
      const commentDepth = comments.comments[commentId]?.depth;
      const isDeepComment = commentDepth >= 9;
      let threadList: CommentThreadList;

      if (isDeepComment) {
        threadList = await client.getComments(postId, {
          baseDepth: commentDepth,
          commentId,
          limit,
          sort,
        });
        delete threadList.comments[commentId];
      } else {
        threadList = await client.getMoreComments(
          postId,
          commentIds,
          { commentId, sort },
        );
      }

      prefetchAvatars(Object.values(threadList.comments));
      return threadList;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<CommentThreadList>(
        ["post-comments", postId, { limit, sort }],
        (threadList) => produce(threadList, (draft) => {
          Object.assign(draft.comments, data.comments);
          if (commentId) {
            const comment = draft.comments[commentId];
            comment.childIds.push(...data.rootCommentIds);
            comment.moreChildren = data.moreComments;
          } else {
            draft.rootCommentIds.push(...data.rootCommentIds);
            draft.moreComments = data.moreComments;
          }
        }),
      );

      if (commentId) {
        queryClient.invalidateQueries(["comments", "detail", commentId]);
      }
    },
  });
}

function prefetchAvatars(submissions: Submission[]) {
  const authorIds = getSubmissionAuthorIds(submissions);
  const newAuthorIds = authorIds.filter((id) =>
    !queryClient.getQueryData(["avatars", "detail", id])
  );
  const newAvatarsPromise = client.getAvatars(newAuthorIds);

  for (const authorId of authorIds) {
    queryClient.prefetchQuery({
      queryFn: async () => {
        const newAvatars = await newAvatarsPromise;
        return newAvatars[authorId];
      },
      queryKey: ["avatars", "detail", authorId],
      staleTime: Infinity,
    });
  }
}

export function useAvatar(authorId: string) {
  const { data } = useQuery({
    queryFn: async () => {
      const avatars = await client.getAvatars([authorId]);
      return avatars[authorId];
    },
    queryKey: ["avatars", "detail", authorId],
    enabled: !!authorId,
    cacheTime: Infinity,
  });

  return data;
}

export function useSubreddits(ids: string[], { enabled = true } = {}) {
  return useQuery({
    enabled,
    queryFn: () => client.getSubreddits(ids),
    queryKey: ["subreddits", ...ids],
  });
}

export function useIdentity({ enabled = true } = {}) {
  return useQuery({
    enabled,
    queryFn: async () => client.getIdentity(),
    queryKey: ["identity"],
  });
}

export function useMySubscriptions({ enabled = true } = {}) {
  return useQuery({
    enabled,
    queryFn: () => client.getMySubscriptions(),
    queryKey: ["my-subscriptions"],
  });
}

function updatePostInCache({ id }: Post, updater: (v: Post) => Post) {
  queryClient.setQueriesData<Post>(
    ["post", id],
    (post) => updater(post),
  );

  queryClient.setQueriesData<InfiniteData<Post[]>>(
    {
      exact: false,
      queryKey: ["post-feed"],
    },
    (data) => produce(data, (draft) => {
      for (const posts of draft.pages) {
        for (const post of posts) {
          if (post.id == id) {
            Object.assign(post, updater(post));
            return;
          }
        }
      }
    }),
  );
}

function updateCommentInCache(
  { id, postId }: Comment,
  updater: (v: Comment) => Comment,
) {
  queryClient.setQueriesData<Comment>(
    ["comments", "detail", id],
    (comment) => updater(comment),
  );

  queryClient.setQueriesData<CommentThreadList>(
    {
      exact: false,
      queryKey: ["post-comments", postId],
    },
    (data) => produce(data, (draft) => {
      const comment = draft.comments[id];
      if (comment) Object.assign(comment, updater(comment));
    }),
  );
}

function addCommentInCache(comment: Comment) {
  const { id, parentId, postId } = comment;

  queryClient.setQueriesData<CommentThreadList>(
    {
      exact: false,
      queryKey: ["post-comments", postId],
    },
    (threadList) => produce(threadList, (draft) => {
      draft.comments[id] = comment;
      if (parentId == postId) {
        draft.rootCommentIds.unshift(id);
      } else {
        const parentComment = draft.comments[parentId];
        updateCommentInCache(parentComment, (comment) => ({
          ...comment,
          childIds: [id, ...comment.childIds],
        }));
      }
    }),
  );
}

export function useVote(submission: Submission) {
  return useMutation({
    mutationFn: ({ direction }: { direction: VoteDirection }) => (
      client.vote(submission.id, direction)
    ),
    onSuccess: (_, { direction }) => {
      const updater = <T extends Submission>(submission: T): T => ({
        ...submission,
        score: submission.score + (direction - submission.voteDirection),
        voteDirection: direction,
      });

      if ("commentCount" in submission) {
        updatePostInCache(submission, updater);
      } else {
        updateCommentInCache(submission, updater);
      }
    },
  });
}

export function usePostComment() {
  return useMutation({
    mutationFn: ({ parentId, text }: { parentId: string, text: string }) =>
      client.comment(parentId, text),
    onSuccess: (comment) => {
      addCommentInCache(comment);
    },
  });
}
