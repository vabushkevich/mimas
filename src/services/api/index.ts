import { useCallback } from "react";
import {
  CommentSortingMethod,
  PostSortingMethod,
  SortTimeInterval,
  isSortRequiresTimeInterval,
  CommentThreadList,
  Submission,
} from "@types";
import * as Raw from "./types";
import {
  getIdSuffix,
} from "./utils";
import { getAccessToken } from "@services/authorization";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "react-query";
import { usePostParams } from "@hooks";
import produce from "immer";
import { groupBy } from "lodash-es";
import { getIdType, getSubmissionAuthorIds } from "@utils";

import {
  transformPost,
  transformShortUsers,
  transformCommentListItems,
  transformFullUser,
  transformSubreddit,
} from "./transformers";

export class RedditWebAPI {
  #getAccessToken: () => Promise<string>;

  constructor(accessToken: string)
  constructor(getAccessToken: () => Promise<string>)
  constructor(arg: string | (() => Promise<string>)) {
    this.#getAccessToken = typeof arg == "string" ? async () => arg : arg;
  }

  async #fetchWithAuth(...[input, init = {}]: Parameters<typeof fetch>) {
    const accessToken = await this.#getAccessToken();
    return await fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        "Authorization": `Bearer ${accessToken}`,
      }
    });
  }

  async getPost(id: string) {
    return (await this.getPosts([id]))[0];
  }

  async getPosts(ids: string[]) {
    if (ids.length == 0) return [];
    const rawPosts = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${ids}`,
    )
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Post>>)
      .then((json) => json.data.children);
    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getFeedPosts(
    {
      after,
      limit,
      sort = "hot",
      sortTimeInterval = "day",
      subreddit,
      userName,
    }: {
      after?: string;
      limit?: number;
      sort?: PostSortingMethod;
      sortTimeInterval?: SortTimeInterval;
      subreddit?: string;
      userName?: string;
    }
  ) {
    const params = new URLSearchParams();
    if (after) params.append("after", after);
    if (limit) params.append("limit", String(limit));
    if (sortTimeInterval && isSortRequiresTimeInterval(sort)) {
      params.append("t", sortTimeInterval);
    }
    if (sort && userName) params.append("sort", sort);

    let url = "https://oauth.reddit.com";
    if (userName) {
      url += `/user/${userName}/submitted`;
    } else if (subreddit) {
      url += `/r/${subreddit}`;
      if (sort) url += `/${sort}`;
    }
    url += `?${params}`;

    const rawPosts = await this.#fetchWithAuth(url)
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Post>>)
      .then((json) => json.data.children);

    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getSubreddit(id: string) {
    return (await this.getSubreddits([id]))[0];
  }

  async getSubreddits(ids: string[]) {
    if (ids.length == 0) return [];
    const rawSubreddits = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${ids}`,
    )
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
      .then((json) => json.data.children);
    return rawSubreddits.map(
      (rawSubreddit) => transformSubreddit(rawSubreddit)
    );
  }

  async getSubredditByName(name: string) {
    const rawSubreddit = await this.#fetchWithAuth(
      `https://oauth.reddit.com/r/${name}/about`,
    )
      .then((res) => res.json() as Promise<Raw.Subreddit>)
    return transformSubreddit(rawSubreddit);
  }

  async getComments(
    postId: string,
    {
      baseDepth,
      commentId,
      limit = 50,
      sort,
    }: {
      baseDepth?: number,
      commentId?: string,
      limit?: number;
      sort?: CommentSortingMethod;
    } = {}
  ) {
    const params = new URLSearchParams({
      limit: String(limit),
      threaded: "false",
    });
    if (sort) params.set("sort", sort);
    if (commentId) params.set("comment", getIdSuffix(commentId));

    type JSONType = [Raw.Listing<Raw.Post>, Raw.Listing<Raw.CommentListItem>];
    const items: (Raw.CommentListItem)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${getIdSuffix(postId)}?${params}`,
    )
      .then((res) => res.json() as Promise<JSONType>)
      .then((json) => json[1].data.children);

    return transformCommentListItems(items, commentId || postId, baseDepth);
  }

  async getMoreComments(
    postId: string,
    commentIds: string[],
    {
      commentId,
      sort,
    }: {
      commentId?: string,
      sort?: CommentSortingMethod,
    } = {}
  ) {
    const formData = new FormData();
    formData.append("api_type", "json");
    formData.append(
      "children",
      commentIds.map((id) => getIdSuffix(id)).join()
    );
    formData.append("link_id", postId);
    if (sort) formData.append("sort", sort);

    const items = await this.#fetchWithAuth(
      "https://oauth.reddit.com/api/morechildren",
      { body: formData, method: "POST" },
    )
      .then((res) => res.json() as Promise<Raw.Things<Raw.CommentListItem>>)
      .then((json) => json.json.data.things);

    return transformCommentListItems(items, commentId || postId);
  }

  async getUserByName(name: string) {
    const rawFullUser = await this.#fetchWithAuth(
      `https://oauth.reddit.com/user/${name}/about`,
    )
      .then((res) => res.json() as Promise<Raw.FullUser>);
    return transformFullUser(rawFullUser);
  }

  async getUsers(ids: string[]) {
    if (ids.length == 0) return [];
    const rawShortUsers =
      await this.#fetchWithAuth(
        `https://oauth.reddit.com/api/user_data_by_account_ids?ids=${ids}`,
      )
        .then((res) => res.json() as Promise<Record<string, Raw.ShortUser>>);
    return transformShortUsers(rawShortUsers);
  }

  async getAvatars(authorIds: string[]) {
    const {
      user: userIds = [],
      subreddit: subredditIds = [],
    } = groupBy(authorIds, getIdType);

    const authors = [
      ...await this.getUsers(userIds),
      ...await this.getSubreddits(subredditIds),
    ];

    const avatars = authors.reduce(
      (res, author) => (res[author.id] = author.avatar, res),
      {} as Record<string, string>,
    );

    return avatars;
  }
}

const client = new RedditWebAPI(getAccessToken);

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
  const loadAvatars = useLoadAvatars();
  return useQuery(["post", id], async () => {
    const post = await client.getPost(id);
    loadAvatars([post]);
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
  const loadAvatars = useLoadAvatars();
  const {
    limit,
    sort,
    sortTimeInterval,
    subreddit,
    userName,
  } = options;

  return useInfiniteQuery(
    [subreddit || userName, limit, sort, sortTimeInterval],
    async ({ pageParam }) => {
      const posts = await client.getFeedPosts({
        ...options,
        after: pageParam,
      });
      loadAvatars(posts);
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
  const loadAvatars = useLoadAvatars();
  return useQuery({
    queryKey: ["post-comments", postId, { limit, sort }],
    queryFn: async () => {
      const threadList = await client.getComments(postId, { limit, sort });
      loadAvatars(Object.values(threadList.comments));
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
  const loadAvatars = useLoadAvatars();

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

      loadAvatars(Object.values(threadList.comments));
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

function useLoadAvatars() {
  const queryClient = useQueryClient();

  return useCallback(async (submissions: Submission[]) => {
    const authorIds = getSubmissionAuthorIds(submissions);
    const newAuthorIds = authorIds.filter((id) =>
      !queryClient.getQueryData(["avatars", "detail", id])
    );
    const newAvatars = await client.getAvatars(newAuthorIds);

    for (const authorId in newAvatars) {
      const avatar = newAvatars[authorId];
      queryClient.setQueryData(["avatars", "detail", authorId], avatar);
    }
  }, [queryClient]);
}

export function useAvatar(authorId: string) {
  const queryClient = useQueryClient();
  const { data } = useQuery(["avatars", "detail", authorId], {
    cacheTime: Infinity,
    queryFn: () => {
      const avatars = queryClient.getQueryData<Record<string, string>>(
        ["avatars"],
      );
      const avatar = avatars?.[authorId];
      return avatar;
    },
  });

  return data;
}

export function useSubreddits(ids: string[]) {
  return useQuery(
    ["subreddits", ...ids],
    () => client.getSubreddits(ids),
  );
}
