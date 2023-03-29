import React from "react";
import { findLast } from "lodash-es";
import type { VideoPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { post } = props;
  const preview = findLast(post.preview.sizes, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <div className="video-post-body">
        <Video hls src={post.hlsURL} poster={preview.src} />
      </div>
    </BasePost>
  );
}
