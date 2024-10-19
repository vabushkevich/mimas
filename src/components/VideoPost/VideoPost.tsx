import React, { useRef } from "react";
import classNames from "classnames";
import { useMediaPlayback } from "@hooks";
import type { VideoPost, PostProps } from "@types";

import { BasePost } from "../BasePost/BasePost";
import { Video } from "../Video/Video";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { hlsURL, previewVariants, width, height } = props.post;
  const preview = previewVariants.findLast(({ width }) => width <= 960);
  const ref = useRef<HTMLDivElement>(null);
  const playerProps = useMediaPlayback(ref, props.post.id);

  return (
    <BasePost {...props}>
      <div
        className={classNames(
          "video-post-body",
          props.large && "video-post-body--large",
        )}
        ref={ref}
      >
        <Video
          isHLS
          src={hlsURL}
          poster={preview?.src}
          width={width}
          height={height}
          {...playerProps}
        />
      </div>
    </BasePost>
  );
}
