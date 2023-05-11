import React from "react";
import type { RemovedPost, PostProps } from "@types";

import { BasePost, Alert } from "@components";
import "./RemovedPost.scss";

const removalReasonMessages: Record<RemovedPost["removalReason"], string> = {
  "rules-violation": "Post removed by Reddit for violating Reddit's rules.",
  "spam": "Post removed by Reddit's spam filters.",
  "user": "Post removed by author.",
  "moderator": "Post removed by subreddit moderator.",
};

export function RemovedPost(props: PostProps<RemovedPost>) {
  return (
    <BasePost {...props}>
      <div className="removed-post-body">
        <Alert>{removalReasonMessages[props.post.removalReason]}</Alert>
      </div>
    </BasePost>
  );
}
