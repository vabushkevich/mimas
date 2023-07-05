import React, { useEffect } from "react";
import { usePagination, usePreloadImage } from "@hooks";
import type { Gallery } from "@types";

import { Loader } from "@components";
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
  const imageLoaded = usePreloadImage(image?.src);

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
          onClose?.();
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
          <img
            key={image?.src}
            className="gallery-viewer__image"
            src={image?.src}
            alt={caption}
            width={image?.width}
            height={image?.height}
            onClick={onClose}
          />
          {!imageLoaded && (
            <div className="gallery-viewer__loader">
              <Loader colorMode="light" />
            </div>
          )}
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
      </div>
      <div className="gallery-viewer__footer">
        {caption && <div className="gallery-viewer__caption">{caption}</div>}
        {pageCount > 1 && (
          <div className="gallery-viewer__counter">
            {page + 1} of {pageCount}
          </div>
        )}
      </div>
      <button className="gallery-viewer__close-btn" onClick={onClose}></button>
    </div>
  );
}
