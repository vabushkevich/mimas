import React, { useState } from "react";
import type { GalleryPost, PostProps } from "@types";

import { BasePost } from "../BasePost/BasePost";
import { Gallery } from "../Gallery/Gallery";
import { GalleryViewer } from "../GalleryViewer/GalleryViewer";
import "./GalleryPost.scss";

export function GalleryPost(props: PostProps<GalleryPost>) {
  const { gallery } = props.post;

  const [showViewer, setShowViewer] = useState(false);
  const [initialItemId, setInitialItemId] = useState<string>();

  return (
    <BasePost {...props}>
      <Gallery
        gallery={gallery}
        onItemClick={(id) => {
          setInitialItemId(id);
          setShowViewer(true);
        }}
      />
      {showViewer && (
        <GalleryViewer
          gallery={gallery}
          initialItemId={initialItemId}
          onClose={() => setShowViewer(false)}
        />
      )}
    </BasePost>
  );
}
