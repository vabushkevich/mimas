import React, { useRef } from "react";
import { findLast } from "lodash-es";
import { useOnScreenMedia } from "@hooks";
import type { VideoPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { hlsURL, previewVariants, width, height } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreenMedia(ref);

  return (
    <BasePost {...props}>
      <div className="video-post-body" ref={ref}>
        <Video
          isHLS
          src={hlsURL}
          poster={preview?.src}
          started={isOnScreen}
          width={width}
          height={height}
        />
      </div>
    </BasePost>
  );
}
