import {
  CommentSortingMethod,
} from "@types";
import * as Raw from "./types";
import {
  getIdSuffix,
} from "./utils";
import {
  buildThreadList,
  transformPost,
  transformUsers,
} from "./transformers";

export class RedditWebAPI {
  #accessToken: string;

  constructor(accessToken: string) {
    this.#accessToken = accessToken;
  }

  async #fetchWithAuth(...[input, init = {}]: Parameters<typeof fetch>) {
    return await fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        "Authorization": `Bearer ${this.#accessToken}`,
      }
    });
  }

  async getPosts(ids: string[]) {
    const rawPosts: Raw.Post[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${ids}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children);
    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getHotPosts({
    after,
    limit,
  }: {
    after?: string;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams();
    if (after) params.append("after", after);
    if (limit) params.append("limit", String(limit));

    const rawPosts: Raw.Post[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/hot?${params}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children);

    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getSubredditInfo(name: string): Promise<Raw.Subreddit> {
    return await this.#fetchWithAuth(
      `https://oauth.reddit.com/r/${name}/about`,
    )
      .then((res) => res.json())
      .then((json) => json.data);
  }

  async getComments(
    postId: string,
    {
      commentId,
      limit = 50,
      sort,
    }: {
      commentId?: string,
      limit?: number;
      sort?: CommentSortingMethod;
    } = {}
  ) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (sort) params.set("sort", sort);
    if (commentId) params.set("comment", getIdSuffix(commentId));

    const items: (Raw.CommentListItem)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${getIdSuffix(postId)}?${params}`,
    )
      .then((res) => res.json())
      .then((json) => json[1].data.children);

    return buildThreadList(items);
  }

  async getMoreComments(
    postId: string,
    commentIds: string[],
    {
      sort,
    }: {
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

    const items: (Raw.CommentListItem)[] = await this.#fetchWithAuth(
      "https://oauth.reddit.com/api/morechildren",
      { body: formData, method: "POST" },
    )
      .then((res) => res.json())
      .then((json) => json.json.data.things);

    return buildThreadList(items);
  }

  async getUsers(ids: string[]) {
    const rawUsers: Record<string, Raw.User> = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/user_data_by_account_ids?ids=${ids}`,
    )
      .then((res) => res.json());
    return transformUsers(rawUsers);
  }
}
