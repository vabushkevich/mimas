import React from "react";
import { findLast } from "lodash-es";
import type { ImagePost, PostProps } from "@types";

import { BasePost } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  const { sizes, source } = props.post.image;
  const preview = findLast(sizes, ({ width }) => width <= 960);

  return (
    <BasePost {...props}>
      <a className="image-post-body" href={source.src}>
        <img src={preview.src} alt="" />
      </a>
    </BasePost>
  );
}
