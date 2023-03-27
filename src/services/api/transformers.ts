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
  Identity,
  ResponsiveImage,
} from "@types";
import * as Raw from "./types";
import { createId } from "@utils";

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
      likes,
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
    commentCount: num_comments,
    dateCreated: created_utc * 1000,
    id: name,
    locked,
    pinned: stickied,
    score,
    subreddit,
    subredditId: subreddit_id,
    title: title,
    url: permalink,
    userName: author,
    voteDirection: likes != null ? (likes ? 1 : -1) : 0,
  };

  if (author_fullname) post.userId = author_fullname;
  if (removed_by_category) {
    post.removalReason = removalReasonMap[removed_by_category];
  }
  if (typeof edited == "number") post.dateEdited = edited * 1000;

  if (isImagePost(rawPost)) {
    const rawResponsiveImage = preview.images[0];
    const image = transformResponsiveImageLong(rawResponsiveImage);

    return {
      ...post,
      type: "image",
      image,
    };
  }

  if (isVideoPost(rawPost)) {
    const rawResponsiveImage = preview.images[0];
    const image = transformResponsiveImageLong(rawResponsiveImage);

    return {
      ...post,
      type: "video",
      video: {
        preview: image,
        src: media.reddit_video.hls_url,
      },
    };
  }

  if (isGalleryPost(rawPost)) {
    const galleryItems = gallery_data.items.map(({ media_id, caption }) => {
      const rawResponsiveImage = media_metadata[media_id];
      return {
        id: media_id,
        caption,
        image: transformResponsiveImageShort(rawResponsiveImage),
      };
    });

    return {
      ...post,
      type: "gallery",
      gallery: { items: galleryItems },
    };
  }

  if (isTextPost(rawPost)) {
    return {
      ...post,
      type: "text",
      bodyHtml: selftext_html,
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

export function transformComment(rawComment: Raw.Comment): Comment {
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
      likes,
      link_id,
      locked,
      name,
      parent_id,
      score_hidden,
      score,
      stickied,
    }
  } = rawComment;

  const comment: Comment = {
    bodyHtml: body_html,
    bodyText: body,
    bySubmitter: is_submitter,
    childIds: [],
    dateCreated: created_utc * 1000,
    depth,
    id: name,
    locked,
    parentId: parent_id,
    pinned: stickied,
    postId: link_id,
    score: score,
    scoreHidden: score_hidden,
    userName: author,
    voteDirection: likes != null ? (likes ? 1 : -1) : 0,
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
    avatar: profile_img,
    commentKarma: comment_karma,
    dateCreated: created_utc * 1000,
    id: userId,
    name,
    postKarma: link_karma,
  };
}

export function transformFullUser(rawFullUser: Raw.FullUser): User {
  return transformFullUserData(rawFullUser.data);
}

function transformFullUserData(rawFullUserData: Raw.FullUser["data"]): User {
  const {
    comment_karma,
    created_utc,
    icon_img,
    id,
    link_karma,
    name,
  } = rawFullUserData;

  return {
    avatar: icon_img,
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

export function transformIdentity(rawIdentity: Raw.Identity): Identity {
  return {
    user: transformFullUserData(rawIdentity),
  }
}

function transformResponsiveImageLong(
  rawResponsiveImage: Raw.ResponsiveImageLong,
): ResponsiveImage {
  const rawSizes = rawResponsiveImage.resolutions;
  const rawSource = rawResponsiveImage.source;

  return {
    sizes: rawSizes.map((rawSize) => ({
      height: rawSize.height,
      src: rawSize.url,
      width: rawSize.width,
    })),
    source: {
      height: rawSource.height,
      src: rawSource.url,
      width: rawSource.width,
    },
  };
}

function transformResponsiveImageShort(
  rawResponsiveImage: Raw.ResponsiveImageShort,
): ResponsiveImage {
  const rawSizes = rawResponsiveImage.p;
  const rawSource = rawResponsiveImage.s;

  return {
    sizes: rawSizes.map((rawSize) => ({
      height: rawSize.y,
      src: rawSize.u,
      width: rawSize.x,
    })),
    source: {
      height: rawSource.y,
      src: rawSource.u,
      width: rawSource.x,
    },
  };
}
