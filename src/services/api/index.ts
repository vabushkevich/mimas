import {
  CommentSortingMethod,
  PostSortingMethod,
  SortTimeInterval,
  CommentThreadList,
  Submission,
  VoteDirection,
} from "@types";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { usePostParams } from "@hooks";
import { client } from "./client";
import {
  addCommentToCache,
  addCommentsToCache,
  prefetchAvatars,
  updateCommentInCache,
  updatePostInCache,
} from "./utils";
import { useLocation } from "react-router-dom";

export function usePosts(ids: string[]) {
  return useQuery(["posts", ...ids], () => client.getPosts(ids), {
    enabled: ids.length > 0,
    placeholderData: [],
  });
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
  const { limit, sort, sortTimeInterval, subreddit, userName } = options;

  const { key } = useLocation();

  return useInfiniteQuery(
    ["post-feed", subreddit ?? userName, limit, sort, sortTimeInterval, key],
    async ({ pageParam }) => {
      const posts = await client.getFeedPosts({
        ...options,
        after: pageParam,
      });
      prefetchAvatars(posts);
      return posts;
    },
    {
      getNextPageParam: (lastPosts) => lastPosts.at(-1)?.id,
      placeholderData: { pages: [], pageParams: [] },
      cacheTime: 60 * 60 * 1000,
    },
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
  const { key } = useLocation();

  return useQuery({
    queryKey: ["post-comments", postId, { limit, sort }, key],
    queryFn: async () => {
      const threadList = await client.getComments(postId, { limit, sort });
      prefetchAvatars(Object.values(threadList.comments));
      return threadList;
    },
    cacheTime: 60 * 60 * 1000,
  });
}

export function useComment(id: string) {
  const queryClient = useQueryClient();
  const { key } = useLocation();

  const getComment = () => {
    const comments = queryClient.getQueryData<CommentThreadList>(
      ["post-comments"],
      {
        type: "active",
        exact: false,
      },
    );
    const comment = comments?.comments[id];
    return comment;
  };

  return useQuery({
    queryKey: ["comments", "detail", id, key],
    queryFn: getComment,
    initialData: getComment,
    cacheTime: 60 * 60 * 1000,
  });
}

export function useLoadMoreComments({
  commentId,
  limit,
}: {
  commentId?: string;
  limit?: number;
} = {}) {
  const { postId, sort } = usePostParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const comments = queryClient.getQueryData<CommentThreadList>(
        ["post-comments"],
        { type: "active", exact: false },
      );
      let moreCommentIds: string[] | undefined;

      if (!comments) throw new Error("Can't get active post comments");

      if (commentId != null) {
        const comment = comments.comments[commentId];
        const isDeepComment = comment.depth >= 9;

        if (isDeepComment) {
          return client.getComments(postId, {
            baseDepth: comment.depth,
            commentId,
            limit,
            sort,
          });
        }

        moreCommentIds = comment.moreChildren?.ids;
      } else {
        moreCommentIds = comments.moreComments?.ids;
      }

      if (!moreCommentIds) throw new Error("Can't get comment ids to load");

      return client.getMoreComments(postId, moreCommentIds, {
        commentId,
        sort,
      });
    },
    onSuccess: (data) => {
      prefetchAvatars(Object.values(data.comments));
      addCommentsToCache(data, postId, commentId);
    },
  });
}

export function useAvatar(authorId?: string) {
  const { data } = useQuery({
    queryFn: async () => {
      if (authorId == null) return;
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

export function useVote(submission: Submission) {
  return useMutation({
    mutationFn: ({ direction }: { direction: VoteDirection }) =>
      client.vote(submission.id, direction),
    onSuccess: (_, { direction }) => {
      const updater = (submission: Submission) => {
        submission.score += direction - submission.voteDirection;
        submission.voteDirection = direction;
      };

      if ("commentCount" in submission) {
        updatePostInCache(submission.id, updater);
      } else {
        updateCommentInCache(submission.postId, submission.id, updater);
      }
    },
  });
}

export function usePostComment() {
  return useMutation({
    mutationFn: ({ parentId, text }: { parentId: string; text: string }) =>
      client.comment(parentId, text),
    onSuccess: (comment) => {
      addCommentToCache(comment);
    },
  });
}
