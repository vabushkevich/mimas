import {
  CommentSortingMethod,
} from "@types";
import * as Raw from "./types";
import {
  readPost,
  buildThreadList,
  readUsers,
} from "./utils";

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
    return rawPosts.map((rawPost) => readPost(rawPost));
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

    return rawPosts.map((rawPost) => readPost(rawPost));
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
      excludeRootComment = false,
      limit = 50,
      rootCommentId,
      sort,
    }: {
      excludeRootComment?: boolean,
      limit?: number;
      rootCommentId?: string,
      sort?: CommentSortingMethod;
    } = {}
  ) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (sort) params.set("sort", sort);
    if (rootCommentId) params.set("comment", rootCommentId.split("_").at(-1));

    const postIdSuffix = postId.split("_").at(-1);
    const items: (Raw.Comment | Raw.MoreItems)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${postIdSuffix}?${params}`,
    )
      .then((res) => res.json())
      .then((json) => json[1].data.children);

    let threadList = buildThreadList(items);
    if (excludeRootComment) threadList = threadList.threads[0].replies;
    return threadList;
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
      commentIds.map((v) => v.split("_").at(-1)).join()
    );
    formData.append("link_id", postId);
    if (sort) formData.append("sort", sort);

    const items: (Raw.Comment | Raw.MoreItems)[] = await this.#fetchWithAuth(
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
    return readUsers(rawUsers);
  }
}
