import React from "react";
import type { RemovedPost, PostProps } from "@types";

import { BasePost, Alert } from "@components";
import "./RemovedPost.scss";

const removalReasonMessages: Record<RemovedPost["removalReason"], string> = {
  "rules-violation": "Post removed by Reddit for violating Reddit's rules.",
  spam: "Post removed by Reddit's spam filters.",
  author: "Post removed by author.",
  moderator: "Post removed by subreddit moderator.",
  copyright: "Post removed due to copyright claim.",
  "mod-approval": "Post is awaiting moderator approval.",
  community: "Post removed by Reddit's Community team.",
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
