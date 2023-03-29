import React, { useEffect } from "react";
import { usePagination } from "@hooks";
import type { Gallery } from "@types";

import "./GalleryViewer.scss";

type GalleryViewerProps = {
  gallery: Gallery;
  initialItemId?: string;
  onClose?: () => void;
};

export function GalleryViewer({
  gallery,
  initialItemId,
  onClose,
}: GalleryViewerProps) {
  const initialPage = initialItemId
    ? gallery.items.findIndex(({ id }) => id == initialItemId) || 0
    : 0;
  const pageCount = gallery.items.length;
  const { page, prevPage, nextPage } = usePagination({
    initialPage,
    pageCount,
    infinite: true,
  });
  const { caption, imageVariants } = gallery.items[page];
  const image = imageVariants.at(-1);

  useEffect(() => {
    const handleKeyPress = ({ key }: KeyboardEvent) => {
      switch (key) {
        case "ArrowLeft":
          prevPage();
          break;
        case "ArrowRight":
          nextPage();
          break;
        case "Escape":
          onClose();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [prevPage, nextPage, onClose]);

  return (
    <div className="gallery-viewer">
      <div className="gallery-viewer__background" onClick={onClose}></div>
      <div className="gallery-viewer__body">
        <div className="gallery-viewer__view-area">
          <div className="gallery-viewer__image">
            <img
              src={image.src}
              alt={caption}
              width={image.width}
              height={image.height}
              onClick={onClose}
            />
          </div>
          {pageCount > 1 && (
            <>
              <button
                className="gallery-viewer__prev-page-btn"
                onClick={prevPage}
              ></button>
              <button
                className="gallery-viewer__next-page-btn"
                onClick={nextPage}
              ></button>
            </>
          )}
        </div>
        {caption && (
          <div className="gallery-viewer__caption">
            {caption}
          </div>
        )}
      </div>
      {pageCount > 1 && (
        <div className="gallery-viewer__counter">
          {page + 1} of {pageCount}
        </div>
      )}
      <button className="gallery-viewer__close-btn" onClick={onClose}></button>
    </div>
  );
}
