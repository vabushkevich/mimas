import React, { useState } from "react";
import type { GalleryPost, PostProps } from "@types";

import { BasePost, Gallery, GalleryViewer } from "@components";
import "./GalleryPost.scss";

export function GalleryPost(props: PostProps<GalleryPost>) {
  const { gallery } = props.post;

  const [showViewer, setShowViewer] = useState(false);
  const [initialItemId, setInitialItemId] = useState<string>(null);

  return (
    <BasePost {...props}>
      <div className="gallery-post-body">
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
      </div>
    </BasePost>
  );
}
