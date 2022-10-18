import React from "react";
import { Post } from "@types";

import { BasePost, LinkPost } from "@components";

function isLinkPost(post: Post) {
  if (!post.linkUrl) return false;
  switch (new URL(post.linkUrl).hostname) {
    case "www.reddit.com":
    case "i.redd.it":
    case "v.redd.it":
      return false;
  }
  return true;
}

export function PostPreview(props: Post) {
  if (isLinkPost(props)) return <LinkPost {...props} />
  return <BasePost {...props} />;
}
