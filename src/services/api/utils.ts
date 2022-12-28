import * as Raw from "./types";

export function isLinkPost(rawPost: Raw.Post) {
  const { url_overridden_by_dest } = rawPost.data;
  if (!url_overridden_by_dest) return false;
  switch (new URL(url_overridden_by_dest).hostname) {
    case "www.reddit.com":
    case "i.redd.it":
    case "v.redd.it":
      return false;
  }
  return true;
}

export function isTextPost(rawPost: Raw.Post) {
  return typeof rawPost.data.selftext_html == "string";
}

export function isGalleryPost(rawPost: Raw.Post) {
  return "gallery_data" in rawPost.data;
}

export function isVideoPost(rawPost: Raw.Post) {
  return rawPost.data.is_video === true;
}

export function isImagePost(rawPost: Raw.Post) {
  return rawPost.data.post_hint === "image";
}

export function isCommentDeleted(rawComment: Raw.Comment) {
  const { author, body } = rawComment.data;
  if (author != "[deleted]") return false;
  return body == "[deleted]" || body == "[removed]";
}

export function getCommentDeleter(rawComment: Raw.Comment) {
  const { body } = rawComment.data;
  if (!isCommentDeleted(rawComment)) return;
  if (body == "[deleted]") return "user";
  if (body == "[removed]") return "moderator";
}

export function getIdSuffix(id: string) {
  return id.split("_").at(-1);
}
