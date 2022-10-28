import { PostData, SubredditData, CommentThreadListItemData } from "@types";

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

  async getPosts(ids: string[]): Promise<PostData[]> {
    const fullnames = ids.map((id) => `t3_${id}`).join();
    return await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${fullnames}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children.map((post: any) => post.data));
  }

  async getHotPosts({
    after,
    limit,
  }: {
    after?: string,
    limit?: number,
  } = {}): Promise<PostData[]> {
    const params = [];

    if (after) params.push(`after=${after}`);
    if (limit) params.push(`limit=${limit}`);

    return await this.#fetchWithAuth(`https://oauth.reddit.com/hot?${params.join("&")}`)
      .then((res) => res.json())
      .then((json) => json.data.children.map((post: any) => post.data));
  }

  async getSubredditInfo(name: string): Promise<SubredditData> {
    return await this.#fetchWithAuth(
      `https://oauth.reddit.com/r/${name}/about`,
    )
      .then((res) => res.json())
      .then((json) => json.data);
  }

  async getComments(postId: string): Promise<CommentThreadListItemData[]> {
    return await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${postId}`,
    )
      .then((res) => res.json())
      .then((json) => json[1].data.children.map((item: any) => item.data));
  }
}
