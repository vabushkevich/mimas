import React from "react";
import type { LinkPost, PostProps } from "@types";

import { BasePost } from "@components";
import "./LinkPost.scss";

export function LinkPost(props: PostProps<LinkPost>) {
  const url = new URL(props.post.linkUrl);

  return (
    <BasePost {...props}>
      <a className="link-post" href={props.post.linkUrl}>
        <span className="link-post__host">{url.host}</span>
        {url.pathname}
        {url.search}
        {url.hash}
      </a>
    </BasePost>
  );
}
