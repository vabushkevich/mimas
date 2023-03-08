import React from "react";
import type { ImagePost, PostProps } from "@types";

import { BasePost } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  return (
    <BasePost {...props}>
      <a className="image-post-body" href={props.post.image}>
        <img src={props.post.image} alt="" />
      </a>
    </BasePost>
  );
}
