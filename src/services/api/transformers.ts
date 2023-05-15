import {
  getCommentDeleter,
  isCommentDeleted,
  isGalleryPost,
  isImagePost,
  isLinkPost,
  isTextPost,
  isVideoPost,
  isGIFPost,
  isYouTubePost,
  isExternalVideoPost,
  isCrossPost,
  isRemovedPost,
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
  Media,
  VideoPost,
  GalleryPost,
  GIFPost,
  ImagePost,
  LinkPost,
  TextPost,
  YouTubePost,
  CrossPost,
  RemovedPost,
} from "@types";
import * as Raw from "./types";
import { createId } from "@utils";

const removalReasonMap: Record<
  Raw.RemovedPost["data"]["removed_by_category"],
  RemovedPost["removalReason"]
> = {
  content_takedown: "rules-violation",
  reddit: "spam",
  deleted: "user",
  moderator: "moderator",
};

export function transformPost(rawPost: Raw.Post): Post {
  if (isRemovedPost(rawPost)) return transformRemovedPost(rawPost);

  if (isCrossPost(rawPost)) return transformCrossPost(rawPost);
  if (isYouTubePost(rawPost)) return transformYouTubePost(rawPost);
  if (isVideoPost(rawPost)) return transformVideoPost(rawPost);
  if (isExternalVideoPost(rawPost)) return transformExternalVideoPost(rawPost);
  if (isGalleryPost(rawPost)) return transformGalleryPost(rawPost);
  if (isGIFPost(rawPost)) return transformGIFPost(rawPost);
  if (isImagePost(rawPost)) return transformImagePost(rawPost);
  if (isLinkPost(rawPost)) return transformLinkPost(rawPost);
  if (isTextPost(rawPost)) return transformTextPost(rawPost);

  return {
    ...transformBasePost(rawPost),
    type: "text",
    bodyHtml: "",
  };
}

export function transformBasePost(rawPost: Raw.BasePost): BasePost {
  const {
    data: {
      archived,
      author_fullname,
      author,
      created_utc,
      edited,
      likes,
      locked,
      name,
      num_comments,
      permalink,
      score,
      stickied,
      subreddit,
      subreddit_id,
      title,
    },
  } = rawPost;

  const basePost: BasePost = {
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

  if (author_fullname) basePost.userId = author_fullname;
  if (typeof edited == "number") basePost.dateEdited = edited * 1000;

  return basePost;
}

export function transformVideoPost(rawPost: Raw.VideoPost): VideoPost {
  const {
    preview,
    media: {
      reddit_video: { height, hls_url, width },
    },
  } = rawPost.data;
  const rawPreview = preview?.images[0];

  return {
    ...transformBasePost(rawPost),
    type: "video",
    height,
    hlsURL: hls_url,
    previewVariants: rawPreview ? transformResponsiveMedia(rawPreview) : [],
    width,
  };
}

export function transformExternalVideoPost(
  rawPost: Raw.ExternalVideoPost,
): VideoPost {
  const {
    preview: {
      images: [rawPreview],
      reddit_video_preview: { height, hls_url, width },
    },
  } = rawPost.data;

  return {
    ...transformBasePost(rawPost),
    type: "video",
    height,
    hlsURL: hls_url,
    previewVariants: transformResponsiveMedia(rawPreview),
    width,
  };
}

export function transformGalleryPost(rawPost: Raw.GalleryPost): GalleryPost {
  const { gallery_data, media_metadata } = rawPost.data;

  const galleryItems = gallery_data.items.map(({ media_id, caption }) => {
    const rawResponsiveImage = media_metadata[media_id];
    return {
      id: media_id,
      caption,
      imageVariants: transformResponsiveMediaShort(rawResponsiveImage),
    };
  });

  return {
    ...transformBasePost(rawPost),
    type: "gallery",
    gallery: { items: galleryItems },
  };
}

export function transformGIFPost(rawPost: Raw.GIFPost): GIFPost {
  const {
    preview: {
      images: [rawPreview],
    },
  } = rawPost.data;

  return {
    ...transformBasePost(rawPost),
    type: "gif",
    previewVariants: transformResponsiveMedia(rawPreview),
    videoVariants: transformResponsiveMedia(rawPreview.variants.mp4),
  };
}

export function transformImagePost(rawPost: Raw.ImagePost): ImagePost {
  const {
    preview: {
      images: [rawPreview],
    },
  } = rawPost.data;

  return {
    ...transformBasePost(rawPost),
    type: "image",
    imageVariants: transformResponsiveMedia(rawPreview),
  };
}

export function transformLinkPost(rawPost: Raw.LinkPost): LinkPost {
  return {
    ...transformBasePost(rawPost),
    type: "link",
    linkUrl: rawPost.data.url_overridden_by_dest,
  };
}

export function transformTextPost(rawPost: Raw.TextPost): TextPost {
  return {
    ...transformBasePost(rawPost),
    type: "text",
    bodyHtml: rawPost.data.selftext_html,
  };
}

export function transformYouTubePost(rawPost: Raw.YouTubePost): YouTubePost {
  const embedHTML = rawPost.data.media.oembed.html;
  const videoId = embedHTML.match(/\/embed\/([\w-]+)/)[1];

  return {
    ...transformBasePost(rawPost),
    type: "youtube",
    videoId,
  };
}

export function transformCrossPost(rawPost: Raw.CrossPost): CrossPost {
  const { author, author_fullname, crosspost_parent_list } = rawPost.data;

  const crossPost: CrossPost = {
    ...transformBasePost(rawPost),
    type: "crosspost",
    crossPostUserName: author,
    parent: transformPost({ data: crosspost_parent_list[0] }),
  };

  if (author_fullname) crossPost.crossPostUserId = author_fullname;

  return crossPost;
}

export function transformRemovedPost(rawPost: Raw.RemovedPost): RemovedPost {
  return {
    ...transformBasePost(rawPost),
    type: "removed",
    removalReason: removalReasonMap[rawPost.data.removed_by_category],
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
    },
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
    data: { children, count, parent_id },
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

function transformShortUser(rawShortUser: Raw.ShortUser, userId: string): User {
  const { comment_karma, created_utc, link_karma, name, profile_img } =
    rawShortUser;

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
  const { comment_karma, created_utc, icon_img, id, link_karma, name } =
    rawFullUserData;

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
    },
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
  };
}

function transformResponsiveMedia(
  rawResponsiveMedia: Raw.ResponsiveMedia,
): Media[] {
  const rawMediaItems = [
    ...rawResponsiveMedia.resolutions,
    rawResponsiveMedia.source,
  ];

  return rawMediaItems.map((rawMedia) => ({
    height: rawMedia.height,
    src: rawMedia.url,
    width: rawMedia.width,
  }));
}

function transformResponsiveMediaShort(
  rawResponsiveMedia: Raw.ResponsiveMediaShort,
): Media[] {
  const rawSource = rawResponsiveMedia.s;
  const rawMediaItems = [
    ...rawResponsiveMedia.p,
    {
      u: rawSource.u || rawSource.gif,
      x: rawSource.x,
      y: rawSource.y,
    },
  ];

  return rawMediaItems.map((rawMedia) => ({
    height: rawMedia.y,
    src: rawMedia.u,
    width: rawMedia.x,
  }));
}
