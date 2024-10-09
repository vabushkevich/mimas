import {
  CommentSortingOption,
  PostFeedSortingOption,
  SortTimeInterval,
  isSortRequiresTimeInterval,
} from "@types";
import * as Raw from "./types";
import { getAccessToken } from "@services/auth";
import { getIdSuffix, isRedditError } from "./utils";
import { groupBy } from "lodash-es";
import { getIdType, HTTPError } from "@utils";

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

  constructor(accessToken: string);
  constructor(getAccessToken: () => Promise<string>);
  constructor(arg: string | (() => Promise<string>)) {
    this.#getAccessToken = typeof arg == "string" ? async () => arg : arg;
  }

  async #request(
    method: string,
    apiMethod: string,
    { body, params }: { body?: BodyInit; params?: Record<string, string> } = {},
  ) {
    const searchParams = new URLSearchParams({ raw_json: "1", ...params });
    const url = `https://oauth.reddit.com/${apiMethod}?${searchParams}`;
    const accessToken = await this.#getAccessToken();
    const response = await fetch(url, {
      body,
      cache: "no-store",
      headers: { Authorization: `Bearer ${accessToken}` },
      method,
    });

    if (!response.ok) {
      throw new HTTPError(
        `Request failed with status code ${response.status}`,
        response,
      );
    }

    return response;
  }

  async #get(method: string, params?: Record<string, string>) {
    return await this.#request("GET", method, { params });
  }

  async #post(
    method: string,
    params?: Record<string, string>,
    body?: BodyInit,
  ) {
    return await this.#request("POST", method, { body, params });
  }

  async getPost(id: string) {
    return (await this.getPosts([id]))[0];
  }

  async getPosts(ids: string[]) {
    if (ids.length == 0) return [];
    const rawPosts = await this.#get("api/info", { id: ids.join() })
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Post>>)
      .then((json) => json.data.children);
    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getFeedPosts({
    after,
    limit,
    sort = "hot",
    sortTimeInterval = "day",
    subreddit,
    userName,
  }: {
    after?: string;
    limit?: number;
    sort?: PostFeedSortingOption;
    sortTimeInterval?: SortTimeInterval;
    subreddit?: string;
    userName?: string;
  }) {
    const params: Record<string, string> = {};
    if (after) params.after = after;
    if (limit) params.limit = String(limit);
    if (sortTimeInterval && isSortRequiresTimeInterval(sort)) {
      params.t = sortTimeInterval;
    }
    if (sort && userName) params.sort = sort;

    let method = "";
    if (userName) {
      method = `user/${userName}/submitted`;
    } else if (subreddit) {
      method = `r/${subreddit}`;
    }
    if (sort && (subreddit || !userName)) method += `/${sort}`;

    const rawPosts = await this.#get(method, params)
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Post>>)
      .then((json) => json.data.children);

    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getUserComments({
    after,
    limit,
    sort = "new",
    sortTimeInterval = "day",
    userName,
  }: {
    after?: string;
    limit?: number;
    sort?: PostFeedSortingOption;
    sortTimeInterval?: SortTimeInterval;
    userName: string;
  }) {
    const params: Record<string, string> = {};
    if (after) params.after = after;
    if (limit) params.limit = String(limit);
    if (sort) params.sort = sort;
    if (sortTimeInterval && isSortRequiresTimeInterval(sort)) {
      params.t = sortTimeInterval;
    }

    const rawComments = await this.#get(`user/${userName}/comments`, params)
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Comment>>)
      .then((json) => json.data.children);

    return rawComments.map((rawComment) => transformComment(rawComment));
  }

  async getSubreddit(id: string) {
    return (await this.getSubreddits([id]))[0];
  }

  async getSubreddits(ids: string[]) {
    if (ids.length == 0) return [];
    const rawSubreddits = await this.#get("api/info", { id: ids.join() })
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
      .then((json) => json.data.children);
    return rawSubreddits.map((rawSubreddit) =>
      transformSubreddit(rawSubreddit),
    );
  }

  async getSubredditByName(name: string) {
    const rawSubreddit = await this.#get(`r/${name}/about`)
      .then((res) => res.json() as Promise<Raw.Subreddit>)
      .catch(async (error) => {
        if (error instanceof HTTPError) {
          const errorData = await error.response?.json();
          if (isRedditError(errorData) && errorData.reason == "private") {
            return this.#get("api/info", { sr_name: name })
              .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
              .then((json) => json.data.children[0]);
          }
        }
        throw error;
      });
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
      baseDepth?: number;
      commentId?: string;
      limit?: number;
      sort?: CommentSortingOption;
    } = {},
  ) {
    const params: Record<string, string> = {
      limit: String(limit),
      threaded: "false",
    };
    if (commentId) params.comment = getIdSuffix(commentId);
    if (sort) params.sort = sort;

    type JSONType = [Raw.Listing<Raw.Post>, Raw.Listing<Raw.CommentListItem>];
    const items: Raw.CommentListItem[] = await this.#get(
      `comments/${getIdSuffix(postId)}`,
      params,
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
      commentId?: string;
      sort?: CommentSortingOption;
    } = {},
  ) {
    const params: Record<string, string> = {
      api_type: "json",
      link_id: postId,
    };
    if (sort) params.sort = sort;

    const formData = new FormData();
    formData.set("children", commentIds.map((id) => getIdSuffix(id)).join());

    const items = await this.#post("api/morechildren", params, formData)
      .then((res) => res.json() as Promise<Raw.Things<Raw.CommentListItem>>)
      .then((json) => json.json.data.things);

    return transformCommentListItems(items, commentId || postId);
  }

  async getUserByName(name: string) {
    const rawFullUser = await this.#get(`user/${name}/about`).then(
      (res) => res.json() as Promise<Raw.FullUser>,
    );
    return transformFullUser(rawFullUser);
  }

  async getUsers(ids: string[]) {
    if (ids.length == 0) return [];
    const rawShortUsers = await this.#get("api/user_data_by_account_ids", {
      ids: ids.join(),
    }).then((res) => res.json() as Promise<Record<string, Raw.ShortUser>>);
    return transformShortUsers(rawShortUsers);
  }

  async getAvatars(authorIds: string[]) {
    const { user: userIds = [], subreddit: subredditIds = [] } = groupBy(
      authorIds,
      getIdType,
    );

    const authors = (
      await Promise.all([
        this.getUsers(userIds),
        this.getSubreddits(subredditIds),
      ])
    ).flat();

    const avatars = authors.reduce(
      (res, author) => {
        if (author.avatar) res[author.id] = author.avatar;
        return res;
      },
      {} as Record<string, string>,
    );

    return avatars;
  }

  async getIdentity() {
    const rawIdentity = await this.#get("api/v1/me").then(
      (res) => res.json() as Promise<Raw.Identity>,
    );
    return transformIdentity(rawIdentity);
  }

  async getMySubscriptions() {
    const rawSubreddits = await this.#get("subreddits/mine/subscriber")
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
      .then((json) => json.data.children);
    return rawSubreddits.map((rawSubreddit) =>
      transformSubreddit(rawSubreddit),
    );
  }

  async vote(id: string, direction: number) {
    await this.#post("api/vote", { dir: String(direction), id });
  }

  async comment(parentId: string, text: string) {
    const rawComment = await this.#post("api/comment", {
      api_type: "json",
      text,
      thing_id: parentId,
    })
      .then((res) => res.json() as Promise<Raw.Things<Raw.Comment>>)
      .then((json) => json.json.data.things[0]);

    return transformComment(rawComment);
  }

  async editComment(id: string, text: string) {
    const rawComment = await this.#post("api/editusertext", {
      api_type: "json",
      text,
      thing_id: id,
    })
      .then((res) => res.json() as Promise<Raw.Things<Raw.Comment>>)
      .then((json) => json.json.data.things[0]);

    return transformComment(rawComment);
  }

  async bookmark(id: string, action: "add" | "remove" = "add") {
    await this.#post(`api/${action == "add" ? "save" : "unsave"}`, { id });
  }

  async subscribe(subredditName: string, action: "sub" | "unsub" = "sub") {
    await this.#post("api/subscribe", { action, sr_name: subredditName });
  }

  async searchSubreddits(
    query: string,
    { after, limit }: { after?: string; limit?: number } = {},
  ) {
    const params: Record<string, string> = { q: query };
    if (after) params.after = after;
    if (limit) params.limit = String(limit);

    const rawSubreddits = await this.#get("subreddits/search", params)
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Subreddit>>)
      .then((json) => json.data.children);

    return rawSubreddits.map((rawSubreddit) =>
      transformSubreddit(rawSubreddit),
    );
  }

  async searchPosts(
    query: string,
    { after, limit }: { after?: string; limit?: number } = {},
  ) {
    const params: Record<string, string> = { q: query };
    if (after) params.after = after;
    if (limit) params.limit = String(limit);

    const rawPosts = await this.#get("search", params)
      .then((res) => res.json() as Promise<Raw.Listing<Raw.Post>>)
      .then((json) => json.data.children);

    return rawPosts.map((rawPost) => transformPost(rawPost));
  }
}

export const client = new RedditWebAPI(getAccessToken);
