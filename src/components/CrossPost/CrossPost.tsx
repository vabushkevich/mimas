import React from "react";
import type { CrossPost, PostProps } from "@types";

import { BasePost, Post } from "@components";
import "./CrossPost.scss";

export function CrossPost(props: PostProps<CrossPost>) {
  return (
    <BasePost {...props}>
      <div className="cross-post-body">
        <Post
          collapsed={props.collapsed}
          hideFlair
          hideFooter
          large={props.large}
          post={props.post.parent}
        />
      </div>
    </BasePost>
  );
}
