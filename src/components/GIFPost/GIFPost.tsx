import React, { useRef } from "react";
import { findLast } from "lodash-es";
import { useOnScreenMedia } from "@hooks";
import type { GIFPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./GIFPost.scss";

export function GIFPost(props: PostProps<GIFPost>) {
  const { previewVariants, videoVariants } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);
  const video = findLast(videoVariants, ({ width }) => width <= 960);
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreenMedia(ref);

  return (
    <BasePost {...props}>
      <div className="gif-post-body" ref={ref}>
        {preview && video && (
          <Video
            src={video.src}
            poster={preview.src}
            started={isOnScreen}
            width={video.width}
            height={video.height}
          />
        )}
      </div>
    </BasePost>
  );
}
