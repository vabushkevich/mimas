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
  getFlairText,
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
  PublicSubreddit,
  PrivateSubreddit,
  BaseSubreddit,
} from "@types";
import * as Raw from "./types";
import { createId } from "@utils";

const removalReasonMap: Record<
  Raw.RemovedPost["data"]["removed_by_category"],
  RemovedPost["removalReason"]
> = {
  content_takedown: "rules-violation",
  reddit: "spam",
  deleted: "author",
  moderator: "moderator",
  copyright_takedown: "copyright",
  automod_filtered: "mod-approval",
  author: "author",
  community_ops: "community",
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

export function transformBasePost(
  rawPost: Raw.BasePost,
  { extractAdditionalText = true } = {},
): BasePost {
  const {
    data: {
      archived,
      author_flair_richtext,
      author_flair_text,
      author_fullname,
      author,
      created_utc,
      edited,
      likes,
      link_flair_richtext,
      link_flair_text,
      locked,
      name,
      num_comments,
      permalink,
      pinned,
      saved,
      score,
      selftext_html,
      stickied,
      subreddit,
      subreddit_id,
      title,
    },
  } = rawPost;

  const basePost: BasePost = {
    archived,
    bookmarked: saved,
    commentCount: num_comments,
    dateCreated: created_utc * 1000,
    id: name,
    locked,
    pinnedIn: [],
    score,
    subreddit,
    subredditId: subreddit_id,
    title: title,
    url: permalink,
    userName: author,
    voteDirection: likes != null ? (likes ? 1 : -1) : 0,
  };

  const flair = getFlairText({
    richText: link_flair_richtext,
    text: link_flair_text || "",
  });
  const userFlair = getFlairText({
    richText: author_flair_richtext,
    text: author_flair_text || "",
  });

  if (author_fullname) basePost.userId = author_fullname;
  if (typeof edited == "number") basePost.dateEdited = edited * 1000;
  if (flair) basePost.flair = flair;
  if (pinned) basePost.pinnedIn.push("user");
  if (extractAdditionalText && selftext_html) {
    basePost.additionalTextHtml = selftext_html;
  }
  if (stickied) basePost.pinnedIn.push("subreddit");
  if (userFlair) basePost.userFlair = userFlair;

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
  const hlsURLObject = new URL(hls_url);

  return {
    ...transformBasePost(rawPost),
    type: "video",
    height,
    hlsURL: hlsURLObject.origin + hlsURLObject.pathname,
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
  const hlsURLObject = new URL(hls_url);

  return {
    ...transformBasePost(rawPost),
    type: "video",
    height,
    hlsURL: hlsURLObject.origin + hlsURLObject.pathname,
    previewVariants: transformResponsiveMedia(rawPreview),
    width,
  };
}

export function transformGalleryPost(rawPost: Raw.GalleryPost): GalleryPost {
  const { gallery_data, media_metadata } = rawPost.data;

  const galleryItems = gallery_data.items
    .filter(({ media_id }) => media_metadata[media_id].status == "valid")
    .map(({ media_id, caption, outbound_url }) => {
      const rawResponsiveImage = media_metadata[media_id];
      return {
        id: media_id,
        caption,
        imageVariants: transformResponsiveMediaShort(rawResponsiveImage),
        linkURL: outbound_url,
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
  const url = new URL(
    rawPost.data.url_overridden_by_dest,
    "https://www.reddit.com",
  );

  return {
    ...transformBasePost(rawPost),
    type: "link",
    linkUrl: String(url),
  };
}

export function transformTextPost(rawPost: Raw.TextPost): TextPost {
  return {
    ...transformBasePost(rawPost, { extractAdditionalText: false }),
    type: "text",
    bodyHtml: rawPost.data.selftext_html,
  };
}

export function transformYouTubePost(rawPost: Raw.YouTubePost): YouTubePost {
  const embedHTML = rawPost.data.media.oembed.html;
  const videoId = embedHTML.match(/\/embed\/([\w-]+)/)?.[1];

  if (videoId == null) {
    throw new Error("Can't find YouTube video id in embed HTML");
  }

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
    parent: transformPost({ data: crosspost_parent_list[0] } as Raw.Post),
  };

  if (author_fullname) crossPost.crossPostUserId = author_fullname;

  return crossPost;
}

export function transformRemovedPost(rawPost: Raw.RemovedPost): RemovedPost {
  return {
    ...transformBasePost(rawPost, { extractAdditionalText: false }),
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
  let moreComments: MoreItems | undefined;

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
      author_flair_richtext,
      author_flair_text,
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
      link_title,
      locked,
      name,
      parent_id,
      permalink,
      score_hidden,
      score,
      stickied,
      subreddit,
      subreddit_id,
    },
  } = rawComment;

  const comment: Comment = {
    bodyHtml: body_html,
    bodyText: body,
    bySubmitter: is_submitter,
    childIds: [],
    dateCreated: created_utc * 1000,
    depth: depth || 0,
    id: name,
    locked,
    parentId: parent_id,
    pinned: stickied,
    postId: link_id,
    postUrl: permalink.split("/").slice(0, -2).join("/"),
    score: score,
    scoreHidden: score_hidden,
    subreddit,
    subredditId: subreddit_id,
    url: permalink,
    userName: author,
    voteDirection: likes != null ? (likes ? 1 : -1) : 0,
  };

  const userFlair = getFlairText({
    richText: author_flair_richtext,
    text: author_flair_text || "",
  });

  if (author_fullname) comment.userId = author_fullname;
  if (distinguished) comment.distinction = distinguished;
  if (typeof edited == "number") comment.dateEdited = edited * 1000;
  if (link_title) comment.postTitle = link_title;
  if (isCommentDeleted(rawComment)) {
    comment.deletedBy = getCommentDeleter(rawComment);
  }
  if (userFlair) comment.userFlair = userFlair;

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
  const {
    comment_karma,
    created_utc,
    icon_img,
    id,
    link_karma,
    name,
    subreddit: { public_description },
  } = rawFullUserData;

  const user: User = {
    avatar: icon_img,
    commentKarma: comment_karma,
    dateCreated: created_utc * 1000,
    id: createId(id, "user"),
    name,
    postKarma: link_karma,
  };

  if (public_description) user.description = public_description;

  return user;
}

export function transformSubreddit(rawSubreddit: Raw.Subreddit): Subreddit {
  const {
    data: {
      community_icon,
      created_utc,
      display_name,
      icon_img,
      name,
      public_description,
      subreddit_type,
      user_is_subscriber,
    },
  } = rawSubreddit;

  const avatar = (community_icon || icon_img)?.split("?")[0];
  const baseSubreddit: BaseSubreddit = {
    dateCreated: created_utc * 1000,
    id: name,
    name: display_name,
    private: subreddit_type == "private",
    subscribed: !!user_is_subscriber,
  };

  if (avatar) baseSubreddit.avatar = avatar;

  if (rawSubreddit.data.subreddit_type == "private") {
    const privateSubreddit: PrivateSubreddit = {
      ...baseSubreddit,
      private: true,
    };
    return privateSubreddit;
  }

  const {
    data: { active_user_count, subscribers },
  } = rawSubreddit;

  const publicSubreddit: PublicSubreddit = {
    ...baseSubreddit,
    private: false,
    subscribers,
  };

  if (active_user_count) publicSubreddit.activeUserCount = active_user_count;
  if (public_description) publicSubreddit.description = public_description;

  return publicSubreddit;
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
      u: "u" in rawSource ? rawSource.u : rawSource.gif,
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
