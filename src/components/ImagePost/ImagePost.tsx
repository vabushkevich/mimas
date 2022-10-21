import React from "react";
import { ImagePost as ImagePostProps } from "@types";

import { BasePost } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: ImagePostProps) {
  return (
    <BasePost {...props}>
      <a className="image-post-body" href={props.image}>
        <img src={props.image} alt="" />
      </a>
    </BasePost>
  );
}
