import React from "react";
import type { CrossPost, PostProps } from "@types";

import { BasePost, Post } from "@components";
import "./CrossPost.scss";

export function CrossPost(props: PostProps<CrossPost>) {
  return (
    <BasePost {...props}>
      <div className="cross-post-body">
        <Post post={props.post.parent} hideFooter />
      </div>
    </BasePost>
  );
}
