import React from "react";
import { getHostname } from "@utils";
import type { LinkPost, PostProps } from "@types";

import { BasePost, ExternalLink, ExternalLinkText } from "@components";
import "./LinkPost.scss";

export function LinkPost(props: PostProps<LinkPost>) {
  const linkURL = new URL(props.post.linkUrl);
  const faviconURL = `https://www.google.com/s2/favicons?domain=${linkURL.origin}&sz=64`;

  return (
    <BasePost {...props}>
      <ExternalLink className="link-post-body" href={props.post.linkUrl}>
        <span
          className="link-post-body__favicon"
          style={{ backgroundImage: `url(${faviconURL})` }}
        ></span>
        <ExternalLinkText>{getHostname(linkURL)}</ExternalLinkText>
      </ExternalLink>
    </BasePost>
  );
}
