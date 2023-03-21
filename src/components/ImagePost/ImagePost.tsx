import React, { useState } from "react";
import { findLast } from "lodash-es";
import type { ImagePost, PostProps } from "@types";

import { BasePost, GalleryViewer } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  const { image } = props.post;
  const preview = findLast(image.sizes, ({ width }) => width <= 960);
  const gallery = { items: [{ id: "0", image }] };
  const [showViewer, setShowViewer] = useState(false);

  return (
    <BasePost {...props}>
      <div className="image-post-body">
        <button
          className="image-post-body__image-btn"
          onClick={() => setShowViewer(true)}
        >
          <img className="image-post-body__image" src={preview.src} alt="" />
        </button>
        {showViewer && (
          <GalleryViewer
            gallery={gallery}
            onClose={() => setShowViewer(false)}
          />
        )}
      </div>
    </BasePost>
  );
}
