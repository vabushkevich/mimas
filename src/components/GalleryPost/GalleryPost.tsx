import React from "react";
import { GalleryPost as GalleryPostProps } from "@types";

import { BasePost, Carousel } from "@components";
import "./GalleryPost.scss";

export function GalleryPost(props: GalleryPostProps) {
  return (
    <BasePost {...props}>
      <div className="gallery-post-body">
        <Carousel images={props.images} />
      </div>
    </BasePost>
  );
}
