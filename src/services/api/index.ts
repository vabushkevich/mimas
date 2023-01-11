import {
  CommentSortingMethod,
  PostSortingMethod,
} from "@types";
import * as Raw from "./types";
import {
  getIdSuffix,
} from "./utils";
import {
  transformPost,
  transformShortUsers,
  transformCommentListItems,
  transformFullUser,
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

  async getPost(id: string) {
    return (await this.getPosts([id]))[0];
  }

  async getPosts(ids: string[]) {
    const rawPosts: Raw.Post[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${ids}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children);
    return rawPosts.map((rawPost) => transformPost(rawPost));
  }

  async getFeedPosts(
    {
      after,
      limit,
      sort = "hot",
      subreddit,
    }: {
      after?: string;
      limit?: number;
      sort?: PostSortingMethod;
      subreddit?: string;
    }
  ) {
    const params = new URLSearchParams();
    if (after) params.append("after", after);
    if (limit) params.append("limit", String(limit));

    let url = "https://oauth.reddit.com";
    if (subreddit) url += `/r/${subreddit}`;
    if (sort) url += `/${sort}`;
    url += `?${params}`;

    const rawPosts: Raw.Post[] = await this.#fetchWithAuth(url)
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

    const items: (Raw.CommentListItem)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${getIdSuffix(postId)}?${params}`,
    )
      .then((res) => res.json())
      .then((json) => json[1].data.children);

    return transformCommentListItems(items, baseDepth);
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

    return transformCommentListItems(items);
  }

  async getUser(name: string) {
    const rawFullUser: Raw.FullUser = await this.#fetchWithAuth(
      `https://oauth.reddit.com/user/${name}/about`,
    )
      .then((res) => res.json());
    return transformFullUser(rawFullUser);
  }

  async getUsers(ids: string[]) {
    const rawShortUsers: Record<string, Raw.ShortUser> =
      await this.#fetchWithAuth(
        `https://oauth.reddit.com/api/user_data_by_account_ids?ids=${ids}`,
      )
        .then((res) => res.json());
    return transformShortUsers(rawShortUsers);
  }
}
