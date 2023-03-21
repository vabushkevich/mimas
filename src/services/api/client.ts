import {
  CommentSortingMethod,
  PostSortingMethod,
  SortTimeInterval,
  isSortRequiresTimeInterval,
} from "@types";
import * as Raw from "./types";
import { getAccessToken } from "@services/auth";
import {
  getIdSuffix,
} from "./utils";
import { groupBy } from "lodash-es";
import { getIdType } from "@utils";

import {
  transformPost,
  transformShortUsers,
  transformCommentListItems,
  transformFullUser,
  transformSubreddit,
  transformIdentity,
  transformComment,
} from "./transformers";

class RedditWebAPI {
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

    const authors = (await Promise.all([
      this.getUsers(userIds),
      this.getSubreddits(subredditIds),
    ])).flat();

    const avatars = authors.reduce(
      (res, author) => (res[author.id] = author.avatar, res),
      {} as Record<string, string>,
    );

    return avatars;
  }

  async getIdentity() {
    const rawIdentity =
      await this.#fetchWithAuth("https://oauth.reddit.com/api/v1/me")
        .then((res) => res.json() as Promise<Raw.Identity>)
    return transformIdentity(rawIdentity);
  }

  async getMySubscriptions() {
    const rawSubreddits =
      await this.#fetchWithAuth(
        "https://oauth.reddit.com/subreddits/mine/subscriber"
      )
        .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
        .then((json) => json.data.children);
    return rawSubreddits.map(
      (rawSubreddit) => transformSubreddit(rawSubreddit)
    );
  }

  async vote(id: string, direction: number) {
    const params = new URLSearchParams({ id, dir: String(direction) });
    await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/vote?${params}`,
      { method: "POST" },
    );
  }

  async comment(parentId: string, text: string) {
    const params = new URLSearchParams({
      api_type: "json",
      text,
      thing_id: parentId,
    });

    const rawComment = await this.#fetchWithAuth(
      "https://oauth.reddit.com/api/comment",
      { body: params, method: "POST" },
    )
      .then((res) => res.json() as Promise<Raw.Things<Raw.Comment>>)
      .then((json) => json.json.data.things[0]);

    return transformComment(rawComment);
  }
}

export const client = new RedditWebAPI(getAccessToken);