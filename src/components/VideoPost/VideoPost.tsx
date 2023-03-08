import React from "react";
import type { VideoPost, PostProps } from "@types";

import { BasePost } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  return (
    <BasePost {...props}>
      <div className="video-post-body">
        <video src={props.post.video} controls></video>
      </div>
    </BasePost>
  );
}
