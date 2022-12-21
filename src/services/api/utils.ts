import {
  PostRaw,
  Post,
  CommentRaw,
  MoreItemsRaw,
  CommentThread,
  UserRaw,
  User,
  MoreItems,
  CommentThreadList,
  Comment,
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

export function readPost(postRaw: PostRaw): Post {
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
      bodyHtml: decodeEntities(postRaw.data.selftext_html),
    };
  }

  if (isLinkPost(postRaw)) {
    return {
      ...post,
      type: "link",
      linkUrl: postRaw.data.url_overridden_by_dest,
    };
  }

  return {
    ...post,
    type: "text",
    bodyHtml: "",
  };
}

function commentIsDeleted(commentRaw: CommentRaw) {
  const { author, body } = commentRaw.data;
  if (author != "[deleted]") return false;
  return body == "[deleted]" || body == "[removed]";
}

function commentIsDeletedBy(commentRaw: CommentRaw) {
  const { body } = commentRaw.data;
  if (!commentIsDeleted(commentRaw)) return;
  if (body == "[deleted]") return "user";
  if (body == "[removed]") return "moderator";
}

function readThread(commentRaw: CommentRaw): CommentThread {
  return {
    comment: readComment(commentRaw),
    replies: readReplies(commentRaw.data.replies),
  };
}

function readComment(commentRaw: CommentRaw): Comment {
  const {
    data: {
      author_fullname,
      author,
      body_html,
      body,
      created_utc,
      distinguished,
      edited,
      is_submitter,
      locked,
      name,
      score_hidden,
      score,
      stickied,
    }
  } = commentRaw;

  const comment: Comment = {
    avatar: "",
    bodyHtml: decodeEntities(body_html),
    bodyText: body,
    bySubmitter: is_submitter,
    dateCreated: created_utc * 1000,
    dateEdited: edited ? edited * 1000 : 0,
    id: name,
    locked,
    pinned: stickied,
    score: score,
    scoreHidden: score_hidden,
    userName: author,
  };

  if (author_fullname) comment.userId = author_fullname;
  if (distinguished) comment.distinction = distinguished;
  if (commentIsDeleted(commentRaw)) {
    comment.deletedBy = commentIsDeletedBy(commentRaw);
  }

  return comment;
}

function readReplies(
  replies: CommentRaw["data"]["replies"],
): CommentThreadList {
  if (replies == "") return { threads: [] };
  return buildThreadList(replies.data.children);
}

export function buildThreadList(
  commentListItems: (CommentRaw | MoreItemsRaw)[],
): CommentThreadList {
  const threads: CommentThread[] = [];
  const threadsCache: Record<string, CommentThread> = {};

  const lastItem = commentListItems.at(-1);
  const preLastItem = commentListItems.at(-2);
  const hasMoreComments = lastItem?.kind == "more" && (
    !preLastItem
    || preLastItem.kind == "more"
    || lastItem.data.parent_id != preLastItem.data.name
  );
  if (hasMoreComments) commentListItems.pop();

  for (const item of commentListItems) {
    const parent = threadsCache[item.data.parent_id];

    if (item.kind == "more") {
      parent.replies.more = {
        ids: item.data.children.map((s) => "t1_" + s),
        totalCount: item.data.count,
      };
      continue;
    }

    const thread = readThread(item);
    if (parent) {
      parent.replies.threads.push(thread);
    } else {
      threads.push(thread);
    }
    threadsCache[thread.comment.id] = thread;
  }

  const threadList: CommentThreadList = { threads };
  if (hasMoreComments) threadList.more = {
    ids: lastItem.data.children.map((s) => "t1_" + s),
    totalCount: lastItem.data.count,
  };
  return threadList;
}

export function readUsers(usersRaw: Record<string, UserRaw>) {
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
