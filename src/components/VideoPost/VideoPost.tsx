import React, { useRef } from "react";
import { findLast } from "lodash-es";
import classNames from "classnames";
import { useLastOnScreenMedia } from "@hooks";
import type { VideoPost, PostProps } from "@types";

import { BasePost, Video } from "@components";
import "./VideoPost.scss";

export function VideoPost(props: PostProps<VideoPost>) {
  const { hlsURL, previewVariants, width, height } = props.post;
  const preview = findLast(previewVariants, ({ width }) => width <= 960);
  const ref = useRef<HTMLDivElement>(null);
  const isLastOnScreen = useLastOnScreenMedia(ref, props.post.id);

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
          started={isLastOnScreen}
          width={width}
          height={height}
        />
      </div>
    </BasePost>
  );
}
