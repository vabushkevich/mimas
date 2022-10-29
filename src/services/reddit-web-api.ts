import {
  SubredditData,
  PostRaw,
  Post,
  CommentRaw,
  MoreItems,
  CommentThread,
} from "@types";
import { findLast } from "lodash-es";
import { decodeEntities } from "@utils";

function isLinkPost(postRaw: PostRaw) {
  const { url_overridden_by_dest } = postRaw.data;
  if (!url_overridden_by_dest) return false;
  switch (new URL(url_overridden_by_dest).hostname) {
    case "www.reddit.com":
    case "i.redd.it":
    case "v.redd.it":
      return false;
  }
  return true;
}

function isTextPost(postRaw: PostRaw) {
  return typeof postRaw.data.selftext_html == "string";
}

function isGalleryPost(postRaw: PostRaw) {
  return "gallery_data" in postRaw.data;
}

function isVideoPost(postRaw: PostRaw) {
  return postRaw.data.is_video === true;
}

function isImagePost(postRaw: PostRaw) {
  return postRaw.data.post_hint === "image";
}

function readPost(postRaw: PostRaw): Post {
  const post = {
    avatar: "",
    commentCount: postRaw.data.num_comments,
    dateCreated: postRaw.data.created_utc * 1000,
    id: postRaw.data.name,
    score: postRaw.data.score,
    subreddit: postRaw.data.subreddit,
    title: postRaw.data.title,
    url: postRaw.data.permalink,
    userName: postRaw.data.author,
  };

  if (isImagePost(postRaw)) {
    const images = postRaw.data.preview.images[0].resolutions;
    const image = findLast(images, (item) => item.width <= 640);
    return {
      ...post,
      type: "image",
      image: decodeEntities(image.url),
    };
  }

  if (isVideoPost(postRaw)) {
    return {
      ...post,
      type: "video",
      video: postRaw.data.media.reddit_video.fallback_url,
    };
  }

  if (isGalleryPost(postRaw)) {
    const images = postRaw.data.gallery_data.items.reduce((out, item) => {
      const images = postRaw.data.media_metadata[item.media_id].p;
      const image = findLast(images, (item) => item.x <= 640);
      out.push(decodeEntities(image.u));
      return out;
    }, []);
    return {
      ...post,
      type: "gallery",
      images,
    };
  }

  if (isTextPost(postRaw)) {
    return {
      ...post,
      type: "text",
      contentHtml: decodeEntities(postRaw.data.selftext_html),
    };
  }

  if (isLinkPost(postRaw)) {
    return {
      ...post,
      type: "link",
      linkUrl: postRaw.data.url_overridden_by_dest,
    };
  }

  return post;
}

function readThread({
  data: {
    author,
    created_utc,
    name,
    replies,
    score,
    body_html,
  }
}: CommentRaw): CommentThread {
  const lastReply = replies && replies.data.children.at(-1);

  return {
    comment: {
      avatar: "",
      contentHtml: decodeEntities(body_html),
      dateCreated: created_utc * 1000,
      id: name,
      score: score,
      userName: author,
    },
    replies: readReplies(replies),
    moreReplies: lastReply && "children" in lastReply.data
      ? [...lastReply.data.children]
      : [],
  };
}

function readReplies(
  replies: CommentRaw["data"]["replies"],
): CommentThread[] {
  if (replies == "") return [];
  return replies.data.children
    .filter((item): item is CommentRaw =>
      !("children" in item.data)
    )
    .map((item) => readThread(item));
}

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
    const fullnames = ids.map((id) => `t3_${id}`).join();
    const postsRaw: PostRaw[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${fullnames}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children);
    return postsRaw.map((postRaw) => readPost(postRaw));
  }

  async getHotPosts({
    after,
    limit,
  }: {
    after?: string,
    limit?: number,
  } = {}) {
    const params = [];

    if (after) params.push(`after=${after}`);
    if (limit) params.push(`limit=${limit}`);

    const postsRaw: PostRaw[] = await this.#fetchWithAuth(`https://oauth.reddit.com/hot?${params.join("&")}`)
      .then((res) => res.json())
      .then((json) => json.data.children);

    return postsRaw.map((postRaw) => readPost(postRaw));
  }

  async getSubredditInfo(name: string): Promise<SubredditData> {
    return await this.#fetchWithAuth(
      `https://oauth.reddit.com/r/${name}/about`,
    )
      .then((res) => res.json())
      .then((json) => json.data);
  }

  async getComments(postId: string) {
    const items: (CommentRaw | MoreItems)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${postId}`,
    )
      .then((res) => res.json())
      .then((json) => json[1].data.children);
    const commentsRaw = items.filter(
      (item): item is CommentRaw => !("children" in item.data)
    );
    const threads = commentsRaw.map((commentRaw) => readThread(commentRaw));
    const lastItem = items.at(-1);
    const moreComments = lastItem && "children" in lastItem.data
      ? lastItem.data.children
      : [];

    return {
      threads,
      more: moreComments,
    };
  }
}
