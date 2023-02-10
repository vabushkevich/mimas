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
  BasePost,
  Subreddit,
} from "@types";
import * as Raw from "./types";
import { findLast } from "lodash-es";
import { decodeEntities, createId } from "@utils";

const removalReasonMap: Record<
  Raw.Post["data"]["removed_by_category"],
  Post["removalReason"]
> = {
  content_takedown: "rules-violation",
  reddit: "spam",
  deleted: "user",
  moderator: "moderator",
};

export function transformPost(rawPost: Raw.Post): Post {
  const {
    data: {
      archived,
      author_fullname,
      author,
      created_utc,
      edited,
      gallery_data,
      locked,
      media_metadata,
      media,
      name,
      num_comments,
      permalink,
      preview,
      removed_by_category,
      score,
      selftext_html,
      stickied,
      subreddit,
      subreddit_id,
      title,
      url_overridden_by_dest,
    }
  } = rawPost;

  const post: BasePost = {
    archived,
    avatar: "",
    commentCount: num_comments,
    dateCreated: created_utc * 1000,
    id: name,
    locked,
    pinned: stickied,
    score,
    subreddit,
    subredditId: subreddit_id,
    title: decodeEntities(title),
    url: permalink,
    userId: author_fullname,
    userName: author,
  };

  if (removed_by_category) {
    post.removalReason = removalReasonMap[removed_by_category];
  }
  if (typeof edited == "number") post.dateEdited = edited * 1000;

  if (isImagePost(rawPost)) {
    const images = preview.images[0].resolutions;
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
      video: media.reddit_video.fallback_url,
    };
  }

  if (isGalleryPost(rawPost)) {
    const images = gallery_data.items.reduce((out, item) => {
      const images = media_metadata[item.media_id].p;
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
      bodyHtml: decodeEntities(selftext_html),
    };
  }

  if (isLinkPost(rawPost)) {
    return {
      ...post,
      type: "link",
      linkUrl: url_overridden_by_dest,
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
  parentId: string,
  baseDepth = 0,
): CommentThreadList {
  const comments: Record<string, Comment> = {};
  const rootCommentIds: string[] = [];
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
    if (comment.parentId == parentId) rootCommentIds.push(comment.id);
  }

  return { comments, moreComments, rootCommentIds };
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
  if (typeof edited == "number") comment.dateEdited = edited * 1000;
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
    ids: children.map((s) => createId(s, "comment")),
    parentId: parent_id,
    totalCount: count,
  };
}

export function transformShortUsers(
  rawShortUsers: Record<string, Raw.ShortUser>,
): User[] {
  const users: User[] = [];

  for (const userId in rawShortUsers) {
    const rawShortUser = rawShortUsers[userId];
    users.push(transformShortUser(rawShortUser, userId));
  }

  return users;
}

function transformShortUser(
  rawShortUser: Raw.ShortUser,
  userId: string,
): User {
  const {
    comment_karma,
    created_utc,
    link_karma,
    name,
    profile_img,
  } = rawShortUser;

  return {
    avatar: decodeEntities(profile_img),
    commentKarma: comment_karma,
    dateCreated: created_utc * 1000,
    id: userId,
    name,
    postKarma: link_karma,
  };
}

export function transformFullUser(rawFullUser: Raw.FullUser): User {
  const {
    data: {
      comment_karma,
      created_utc,
      icon_img,
      id,
      link_karma,
      name,
    }
  } = rawFullUser;

  return {
    avatar: decodeEntities(icon_img),
    commentKarma: comment_karma,
    dateCreated: created_utc * 1000,
    id: createId(id, "user"),
    name,
    postKarma: link_karma,
  };
}

export function transformSubreddit(rawSubreddit: Raw.Subreddit): Subreddit {
  const {
    data: {
      active_user_count,
      community_icon,
      created_utc,
      display_name,
      icon_img,
      name,
      public_description,
      subscribers,
    }
  } = rawSubreddit;

  const avatar = (community_icon || icon_img).split("?")[0];

  return {
    activeUserCount: active_user_count,
    avatar,
    dateCreated: created_utc * 1000,
    description: public_description,
    id: name,
    name: display_name,
    subscribers,
  };
}
