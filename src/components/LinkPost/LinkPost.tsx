import React from "react";
import { getHostname } from "@utils";
import type { LinkPost, PostProps } from "@types";

import { BasePost } from "@components";
import ExternalIcon from "@assets/svg/external.svg";
import "./LinkPost.scss";

export function LinkPost(props: PostProps<LinkPost>) {
  const linkURL = new URL(props.post.linkUrl);
  const faviconURL = `https://www.google.com/s2/favicons?domain=${linkURL.origin}&sz=64`;

  return (
    <BasePost {...props}>
      <a
        className="link-post-body"
        href={props.post.linkUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span
          className="link-post-body__favicon"
          style={{ backgroundImage: `url(${faviconURL})` }}
        ></span>
        <span className="link-post-body__hostname">
          {getHostname(linkURL)}
          <ExternalIcon className="link-post-body__external-icon" />
        </span>
      </a>
    </BasePost>
  );
}
