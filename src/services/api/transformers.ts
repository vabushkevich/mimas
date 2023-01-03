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
  User,
  MoreItems,
  Comment,
  CommentThreadList,
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

export function transformCommentListItems(
  items: Raw.CommentListItem[],
  baseDepth = 0,
): CommentThreadList {
  const comments: Record<string, Comment> = {};
  let moreComments: MoreItems;

  for (const item of items) {
    if (item.kind == "more") {
      const more = transformMoreItems(item);
      const parent = comments[more.parentId];
      if (parent) {
        parent.moreChildren = more;
      } else {
        moreComments = more;
      }
      continue;
    }

    const comment = transformComment(item);
    comment.depth += baseDepth;
    comments[comment.id] = comment;
    if (comments[comment.parentId]) {
      comments[comment.parentId].childIds.push(comment.id);
    }
  }

  return { comments, moreComments };
}

function transformComment(rawComment: Raw.Comment): Comment {
  const {
    data: {
      author_fullname,
      author,
      body_html,
      body,
      created_utc,
      depth,
      distinguished,
      edited,
      is_submitter,
      locked,
      name,
      parent_id,
      score_hidden,
      score,
      stickied,
    }
  } = rawComment;

  const comment: Comment = {
    bodyHtml: decodeEntities(body_html),
    bodyText: body,
    bySubmitter: is_submitter,
    childIds: [],
    dateCreated: created_utc * 1000,
    dateEdited: edited ? edited * 1000 : 0,
    depth,
    id: name,
    locked,
    parentId: parent_id,
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
  const {
    data: {
      children,
      count,
      parent_id,
    }
  } = rawMoreItems;

  return {
    ids: children.map((s) => "t1_" + s),
    parentId: parent_id,
    totalCount: count,
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
