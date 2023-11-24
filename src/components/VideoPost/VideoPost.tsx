import React from "react";
import { findLast } from "lodash-es";
import type { VideoPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { hlsURL, previewVariants, width, height } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <div className="video-post-body">
        <Video
          isHLS
          src={hlsURL}
          poster={preview?.src}
          width={width}
          height={height}
        />
      </div>
    </BasePost>
  );
}
