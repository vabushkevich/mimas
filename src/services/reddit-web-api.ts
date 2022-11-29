import {
  SubredditData,
  PostRaw,
  Post,
  CommentRaw,
  MoreItemsRaw,
  CommentThread,
  CommentsSortingMethod,
  UserRaw,
  User,
  MoreItems,
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
    title: decodeEntities(postRaw.data.title),
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
    author_fullname,
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
      userId: author_fullname || null,
      userName: author,
    },
    replies: readReplies(replies),
    moreReplies: lastReply?.kind == "more"
      ? lastReply.data.children.map((s) => "t1_" + s)
      : [],
    moreRepliesCount: lastReply?.kind == "more" ? lastReply.data.count : 0,
  };
}

function readReplies(
  replies: CommentRaw["data"]["replies"],
): CommentThread[] {
  if (replies == "") return [];
  return replies.data.children
    .filter((item): item is CommentRaw => item.kind == "t1")
    .map((item) => readThread(item));
}

function buildThreadList(commentListItems: (CommentRaw | MoreItemsRaw)[]) {
  const threads: CommentThread[] = [];
  const threadsCache: Record<string, CommentThread> = {};

  const lastItem = commentListItems.at(-1);
  const preLastItem = commentListItems.at(-2);
  const hasMoreComments = lastItem?.kind == "more" && (
    !preLastItem
    || preLastItem.kind == "more"
    || lastItem.data.parent_id != preLastItem.data.name
  );
  const more: MoreItems = {
    totalCount: hasMoreComments ? lastItem.data.count : 0,
    ids: hasMoreComments
      ? lastItem.data.children.map((s) => "t1_" + s)
      : [],
  };
  if (hasMoreComments) commentListItems.pop();

  for (const item of commentListItems) {
    if (item.kind == "more") {
      const parent = threadsCache[item.data.parent_id];
      parent.moreReplies = item.data.children.map((s) => "t1_" + s);
      parent.moreRepliesCount = item.data.count;
      continue;
    }

    const thread = readThread(item);
    const parent = threadsCache[item.data.parent_id];
    if (parent) {
      parent.replies.push(thread);
    } else {
      threads.push(thread);
    }
    threadsCache[thread.comment.id] = thread;
  }

  return { threads, more };
}

function readUsers(usersRaw: Record<string, UserRaw>) {
  const users: User[] = [];

  for (const userId in usersRaw) {
    const userRaw = usersRaw[userId];
    users.push({
      id: userId,
      avatar: decodeEntities(userRaw.profile_img),
    });
  }

  return users;
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
    const postsRaw: PostRaw[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/info?id=${ids}`,
    )
      .then((res) => res.json())
      .then((json) => json.data.children);
    return postsRaw.map((postRaw) => readPost(postRaw));
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

    const postsRaw: PostRaw[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/hot?${params}`,
    )
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

  async getComments(
    postId: string,
    {
      limit = 50,
      sort,
    }: {
      limit?: number;
      sort?: CommentsSortingMethod;
    } = {}
  ) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (sort) params.set("sort", sort);

    const postIdSuffix = postId.split("_").at(-1);
    const items: (CommentRaw | MoreItemsRaw)[] = await this.#fetchWithAuth(
      `https://oauth.reddit.com/comments/${postIdSuffix}?${params}`,
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
      sort?: CommentsSortingMethod,
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

    const items: (CommentRaw | MoreItemsRaw)[] = await this.#fetchWithAuth(
      "https://oauth.reddit.com/api/morechildren",
      { body: formData, method: "POST" },
    )
      .then((res) => res.json())
      .then((json) => json.json.data.things);

    return buildThreadList(items);
  }

  async getUsers(ids: string[]) {
    const usersRaw: Record<string, UserRaw> = await this.#fetchWithAuth(
      `https://oauth.reddit.com/api/user_data_by_account_ids?ids=${ids}`,
    )
      .then((res) => res.json());
    return readUsers(usersRaw);
  }
}
