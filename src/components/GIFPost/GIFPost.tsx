import React from "react";
import { findLast } from "lodash-es";
import type { GIFPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./GIFPost.scss";

export function GIFPost(props: PostProps<GIFPost>) {
  const { post } = props;
  const preview = findLast(post.preview.sizes, ({ width }) => width <= 960);
  const video = findLast(post.video.sizes, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <div className="gif-post-body">
        <Video src={video.src} poster={preview.src} />
      </div>
    </BasePost>
  );
}
