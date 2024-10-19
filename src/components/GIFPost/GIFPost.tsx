import React, { useRef } from "react";
import classNames from "classnames";
import { useMediaPlayback } from "@hooks";
import type { GIFPost, PostProps } from "@types";

import { BasePost } from "../BasePost/BasePost";
import { Video } from "../Video/Video";
import "./GIFPost.scss";

export function GIFPost(props: PostProps<GIFPost>) {
  const { previewVariants, videoVariants } = props.post;
  const preview = previewVariants.findLast(({ width }) => width <= 960);
  const video = videoVariants.findLast(({ width }) => width <= 960);
  const ref = useRef<HTMLDivElement>(null);
  const playerProps = useMediaPlayback(ref, props.post.id);

  return (
    <BasePost {...props}>
      <div
        className={classNames(
          "gif-post-body",
          props.large && "gif-post-body--large",
        )}
        ref={ref}
      >
        {preview && video && (
          <Video
            src={video.src}
            poster={preview.src}
            width={video.width}
            height={video.height}
            {...playerProps}
          />
        )}
      </div>
    </BasePost>
  );
}
