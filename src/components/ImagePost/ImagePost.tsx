import React from "react";
import type { ImagePost, PostProps } from "@types";

import { BasePost } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  return (
    <BasePost {...props}>
      <a className="image-post-body" href={props.post.image.source.src}>
        <img src={props.post.image.source.src} alt="" />
      </a>
    </BasePost>
  );
}
