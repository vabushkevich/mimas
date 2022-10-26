import { PostData } from "@types";

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

  async getHotPosts(): Promise<PostData[]> {
    return await this.#fetchWithAuth("https://oauth.reddit.com/hot")
      .then((res) => res.json())
      .then((json) => json.data.children.map((post: any) => post.data));
  }
}
