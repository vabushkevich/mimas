import React from "react";
import type { GalleryPost, PostProps } from "@types";

import { BasePost, Gallery } from "@components";
import "./GalleryPost.scss";

export function GalleryPost(props: PostProps<GalleryPost>) {
  return (
    <BasePost {...props}>
      <div className="gallery-post-body">
        <Gallery gallery={props.post.gallery} />
      </div>
    </BasePost>
  );
}
