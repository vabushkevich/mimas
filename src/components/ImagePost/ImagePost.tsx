import React, { useState } from "react";
import { findLast } from "lodash-es";
import type { ImagePost, PostProps } from "@types";

import { BasePost, GalleryViewer } from "@components";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  const { imageVariants } = props.post;
  const preview = findLast(imageVariants, ({ width }) => width <= 960);
  const gallery = { items: [{ id: "0", imageVariants }] };
  const [showViewer, setShowViewer] = useState(false);

  return (
    <BasePost {...props}>
      <div className="image-post-body">
        <button
          className="image-post-body__image"
          onClick={() => setShowViewer(true)}
        >
          {preview && (
            <img
              src={preview.src}
              width={preview.width}
              height={preview.height}
            />
          )}
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
