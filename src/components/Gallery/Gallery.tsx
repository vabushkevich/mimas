import React from "react";
import { useIsSmallScreen } from "@hooks";
import type { Gallery } from "@types";

import { AspectRatio } from "../AspectRatio/AspectRatio";
import "./Gallery.scss";

const MAX_DISPLAYED_ITEM_COUNT = 6;

type GalleryProps = {
  gallery: Gallery;
  onItemClick?: (id: string) => void;
};

export function Gallery({ gallery, onItemClick }: GalleryProps) {
  const displayedItems = gallery.items.slice(0, MAX_DISPLAYED_ITEM_COUNT);
  const moreItemCount = gallery.items.length - displayedItems.length;
  const isSmallScreen = useIsSmallScreen();
  const aspectRatio = isSmallScreen ? 6 / 5 : 3 / 2;

  return (
    <AspectRatio ratio={aspectRatio}>
      <div className={`gallery gallery--item-count_${displayedItems.length}`}>
        {displayedItems.map(({ caption, id, imageVariants }) => {
          const preview = imageVariants.findLast(({ width }) => width <= 640);
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
    </AspectRatio>
  );
}
