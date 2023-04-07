import React from "react";
import { findLast } from "lodash-es";
import type { GIFPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./GIFPost.scss";

export function GIFPost(props: PostProps<GIFPost>) {
  const { previewVariants, videoVariants } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);
  const video = findLast(videoVariants, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <div className="gif-post-body">
        <Video src={video.src} poster={preview.src} />
      </div>
    </BasePost>
  );
}