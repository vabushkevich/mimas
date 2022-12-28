import {
  getCommentDeleter,
  isCommentDeleted,
  isGalleryPost,
  isImagePost,
  isLinkPost,
  isTextPost,
  isVideoPost,
} from "./utils";
import {
  Post,
  CommentThread,
  User,
  MoreItems,
  CommentThreadList,
  Comment,
} from "@types";
import * as Raw from "./types";
import { findLast } from "lodash-es";
import { decodeEntities } from "@utils";

export function transformPost(rawPost: Raw.Post): Post {
  const post = {
    avatar: "",
    commentCount: rawPost.data.num_comments,
    dateCreated: rawPost.data.created_utc * 1000,
    id: rawPost.data.name,
    score: rawPost.data.score,
    subreddit: rawPost.data.subreddit,
    title: decodeEntities(rawPost.data.title),
    url: rawPost.data.permalink,
    userName: rawPost.data.author,
  };

  if (isImagePost(rawPost)) {
    const images = rawPost.data.preview.images[0].resolutions;
    const image = findLast(images, (item) => item.width <= 640);
    return {
      ...post,
      type: "image",
      image: decodeEntities(image.url),
    };
  }

  if (isVideoPost(rawPost)) {
    return {
      ...post,
      type: "video",
      video: rawPost.data.media.reddit_video.fallback_url,
    };
  }

  if (isGalleryPost(rawPost)) {
    const images = rawPost.data.gallery_data.items.reduce((out, item) => {
      const images = rawPost.data.media_metadata[item.media_id].p;
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

  if (isTextPost(rawPost)) {
    return {
      ...post,
      type: "text",
      bodyHtml: decodeEntities(rawPost.data.selftext_html),
    };
  }

  if (isLinkPost(rawPost)) {
    return {
      ...post,
      type: "link",
      linkUrl: rawPost.data.url_overridden_by_dest,
    };
  }

  return {
    ...post,
    type: "text",
    bodyHtml: "",
  };
}

export function buildThreadList(
  commentListItems: Raw.CommentListItem[],
): CommentThreadList {
  const threadList: CommentThreadList = { threads: [] };
  const threadsCache: Record<string, CommentThread> = {};

  for (const item of commentListItems) {
    const parent = threadsCache[item.data.parent_id];

    if (item.kind == "more") {
      const more = transformMoreItems(item);
      if (parent) {
        parent.replies.more = more;
      } else {
        threadList.more = more;
      }
      continue;
    }

    const thread = buildThread(item);
    if (parent) {
      parent.replies.threads.push(thread);
    } else {
      threadList.threads.push(thread);
    }
    threadsCache[thread.comment.id] = thread;
  }

  return threadList;
}

function buildThread(rawComment: Raw.Comment): CommentThread {
  const rawReplies = rawComment.data.replies;
  return {
    comment: transformComment(rawComment),
    replies: rawReplies == ""
      ? { threads: [] }
      : buildThreadList(rawReplies.data.children),
  };
}

function transformComment(rawComment: Raw.Comment): Comment {
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
  } = rawComment;

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
  if (isCommentDeleted(rawComment)) {
    comment.deletedBy = getCommentDeleter(rawComment);
  }

  return comment;
}

function transformMoreItems(rawMoreItems: Raw.MoreItems): MoreItems {
  return {
    ids: rawMoreItems.data.children.map((s) => "t1_" + s),
    totalCount: rawMoreItems.data.count,
  };
}

export function transformUsers(rawUsers: Record<string, Raw.User>) {
  const users: User[] = [];

  for (const userId in rawUsers) {
    const rawUser = rawUsers[userId];
    users.push(transformUser(rawUser, userId));
  }

  return users;
}

function transformUser(rawUser: Raw.User, userId: string) {
  return {
    id: userId,
    avatar: decodeEntities(rawUser.profile_img),
  };
}
