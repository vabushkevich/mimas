import React from "react";
import type { LinkPost, PostProps } from "@types";

import { BasePost } from "@components";
import "./LinkPost.scss";

export function LinkPost(props: PostProps<LinkPost>) {
  const { hostname, origin } = new URL(props.post.linkUrl);
  const hostnameDisplayed = hostname.startsWith("www.")
    ? hostname.slice(4)
    : hostname;
  const faviconURL = `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;

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
          {hostnameDisplayed}
          <span className="link-post-body__external-icon"></span>
        </span>
      </a>
    </BasePost>
  );
}
