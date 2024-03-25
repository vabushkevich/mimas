import {
  CommentSortingOption,
  PostFeedSortingOption,
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
  updateSubredditInCache,
} from "./utils";
import { useLocation } from "react-router-dom";

export function usePosts(ids: string[]) {
  return useQuery(["posts", ...ids], () => client.getPosts(ids), {
    enabled: ids.length > 0,
  });
}

export function usePost(id: string) {
  return useQuery(
    ["post", id],
    async () => {
      const post = await client.getPost(id);
      prefetchAvatars([post]);
      return post;
    },
    { staleTime: 0 },
  );
}

export function useFeedPosts(options: {
  limit?: number;
  sort?: PostFeedSortingOption;
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
    },
  );
}

export function useUserComments(options: {
  limit?: number;
  sort?: PostFeedSortingOption;
  sortTimeInterval?: SortTimeInterval;
  userName: string;
}) {
  const { limit, sort, sortTimeInterval, userName } = options;

  const { key } = useLocation();

  return useInfiniteQuery(
    ["comment-feed", userName, limit, sort, sortTimeInterval, key],
    ({ pageParam }) => client.getUserComments({ ...options, after: pageParam }),
    {
      getNextPageParam: (lastComments) => lastComments.at(-1)?.id,
    },
  );
}

export function useSubredditByName(
  name: string,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery(["subreddit", name], () => client.getSubredditByName(name), {
    enabled,
    staleTime: 0,
  });
}

export function useUserByName(name: string) {
  return useQuery(["user", name], () => client.getUserByName(name), {
    staleTime: 0,
  });
}

export function usePostComments(
  postId: string,
  {
    limit,
    sort,
  }: {
    limit?: number;
    sort?: CommentSortingOption;
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
    if (!comment) throw new Error(`Comment ${id} not found in cache`);
    return comment;
  };

  return useQuery({
    queryKey: ["comments", "detail", id, key],
    queryFn: getComment,
    initialData: getComment,
  });
}

export function useLoadMoreComments({
  commentId,
  limit,
}: {
  commentId?: string;
  limit?: number;
} = {}) {
  const { postId, commentSorting } = usePostParams();
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
            sort: commentSorting,
          });
        }

        moreCommentIds = comment.moreChildren?.ids;
      } else {
        moreCommentIds = comments.moreComments?.ids;
      }

      if (!moreCommentIds) throw new Error("Can't get comment ids to load");

      return client.getMoreComments(postId, moreCommentIds, {
        commentId,
        sort: commentSorting,
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
      return avatars[authorId] || null;
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
    cacheTime: Infinity,
    queryFn: () => client.getSubreddits(ids),
    queryKey: ["subreddits", ...ids],
  });
}

export function useIdentity({ enabled = true } = {}) {
  return useQuery({
    enabled,
    cacheTime: Infinity,
    queryFn: async () => client.getIdentity(),
    queryKey: ["identity"],
  });
}

export function useMySubscriptions({ enabled = true } = {}) {
  return useQuery({
    enabled,
    cacheTime: Infinity,
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
        updateCommentInCache(submission.id, updater, {
          postId: submission.postId,
          userName: submission.userName,
        });
      }
    },
  });
}

export function usePostComment({ onSuccess }: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: ({ parentId, text }: { parentId: string; text: string }) =>
      client.comment(parentId, text),
    onSuccess: (comment) => {
      addCommentToCache(comment);
      onSuccess?.();
    },
  });
}

export function useBookmarkPost(id: string) {
  return useMutation({
    mutationFn: (action: "add" | "remove") => client.bookmark(id, action),
    onSuccess: (_, action) => {
      updatePostInCache(id, (post) => {
        post.bookmarked = action == "add";
      });
    },
  });
}

export function useSubscribe(subredditName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "sub" | "unsub") =>
      client.subscribe(subredditName, action),
    onSuccess: (_, action) => {
      updateSubredditInCache(subredditName, (subreddit) => {
        subreddit.subscribed = action == "sub";
      });
      queryClient.invalidateQueries(["my-subscriptions"]);
    },
  });
}

export function useSearchSubreddits(
  query: string,
  { limit }: { limit?: number },
) {
  const { key } = useLocation();

  return useInfiniteQuery(
    ["search-subreddits", query, key],
    ({ pageParam }) =>
      client.searchSubreddits(query, { after: pageParam, limit }),
    {
      getNextPageParam: (lastSubreddits) => lastSubreddits.at(-1)?.id,
    },
  );
}

export function useSearchPosts(
  query: string,
  { limit }: { limit?: number } = {},
) {
  const { key } = useLocation();

  return useInfiniteQuery(
    ["search-posts", query, key],
    async ({ pageParam }) => {
      const posts = await client.searchPosts(query, {
        after: pageParam,
        limit,
      });
      prefetchAvatars(posts);
      return posts;
    },
    {
      getNextPageParam: (lastPosts) => lastPosts.at(-1)?.id,
    },
  );
}
