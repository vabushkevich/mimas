import React, { useState } from "react";
import classNames from "classnames";
import type { ImagePost, PostProps } from "@types";

import { BasePost } from "../BasePost/BasePost";
import { GalleryViewer } from "../GalleryViewer/GalleryViewer";
import "./ImagePost.scss";

export function ImagePost(props: PostProps<ImagePost>) {
  const { imageVariants } = props.post;
  const preview = imageVariants.findLast(({ width }) => width <= 960);
  const gallery = { items: [{ id: "0", imageVariants }] };
  const [showViewer, setShowViewer] = useState(false);

  return (
    <BasePost {...props}>
      <div
        className={classNames(
          "image-post-body",
          props.large && "image-post-body--large",
        )}
      >
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
