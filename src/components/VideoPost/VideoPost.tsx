import React from "react";
import { findLast } from "lodash-es";
import type { VideoPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { hlsURL, previewVariants } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <div className="video-post-body">
        <Video hls src={hlsURL} poster={preview?.src} />
      </div>
    </BasePost>
  );
}
