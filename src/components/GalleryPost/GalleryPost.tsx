import React from "react";
import type { GalleryPost, PostProps } from "@types";

import { BasePost, Carousel } from "@components";
import "./GalleryPost.scss";

export function GalleryPost(props: PostProps<GalleryPost>) {
  return (
    <BasePost {...props}>
      <div className="gallery-post-body">
        <Carousel images={props.post.images} />
      </div>
    </BasePost>
  );
}
