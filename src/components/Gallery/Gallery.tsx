import React from "react";
import { findLast } from "lodash-es";
import type { Gallery } from "@types";

import "./Gallery.scss";

const MAX_DISPLAYED_ITEM_COUNT = 6;

type GalleryProps = {
  gallery: Gallery;
  onItemClick?: (id: string) => void;
};

export function Gallery({ gallery, onItemClick }: GalleryProps) {
  const displayedItems = gallery.items.slice(0, MAX_DISPLAYED_ITEM_COUNT);
  const moreItemCount = gallery.items.length - displayedItems.length;

  return (
    <div className={`gallery gallery--item-count_${displayedItems.length}`}>
      {displayedItems.map(({ caption, id, imageVariants }) => {
        const preview = findLast(imageVariants, ({ width }) => width <= 640);
        return (
          <button
            key={id}
            className="gallery-item"
            onClick={() => onItemClick?.(id)}
          >
            {preview && <img src={preview.src} alt={caption} />}
          </button>
        );
      })}
      {moreItemCount > 0 && (
        <div className="gallery__more-count">{moreItemCount} more</div>
      )}
    </div>
  );
}
