import React from "react";
import { LinkPost as LinkPostProps } from "@types";

import { BasePost } from "@components";
import "./LinkPost.scss";

export function LinkPost(props: LinkPostProps) {
  const url = new URL(props.linkUrl);

  return (
    <BasePost {...props}>
      <a className="link-post" href={props.linkUrl}>
        <span className="link-post__host">{url.host}</span>
        {url.pathname}
        {url.search}
        {url.hash}
      </a>
    </BasePost>
  );
}
