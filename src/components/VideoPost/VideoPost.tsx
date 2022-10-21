import React from "react";
import { VideoPost as VideoPostProps } from "@types";

import { BasePost } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: VideoPostProps) {
  return (
    <BasePost {...props}>
      <div className="video-post-body">
        <video src={props.video} controls></video>
      </div>
    </BasePost>
  );
}
