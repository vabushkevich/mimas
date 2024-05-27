import React, { useEffect } from "react";
import { usePagination, usePreloadImage } from "@hooks";
import { getHostname } from "@utils";
import type { Gallery } from "@types";

import { ExternalLink, ExternalLinkText, Loader } from "@components";
import LeftIcon from "@assets/svg/arrow-left.svg";
import RightIcon from "@assets/svg/arrow-right.svg";
import CrossIcon from "@assets/svg/cross.svg";
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
  const { caption, imageVariants, linkURL } = gallery.items[page];
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
          {(!image?.src || !imageLoaded) && (
            <div className="gallery-viewer__loader">
              <Loader color="white" size="lg" />
            </div>
          )}
          {pageCount > 1 && (
            <>
              <button
                className="gallery-viewer__prev-page-btn"
                onClick={prevPage}
              >
                <LeftIcon className="gallery-viewer__left-arrow-icon" />
              </button>
              <button
                className="gallery-viewer__next-page-btn"
                onClick={nextPage}
              >
                <RightIcon className="gallery-viewer__right-arrow-icon" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="gallery-viewer__footer">
        {(caption || linkURL) && (
          <div className="gallery-viewer__caption">
            {caption && (
              <div className="gallery-viewer__caption-text">{caption}</div>
            )}
            {linkURL && (
              <ExternalLink className="gallery-viewer__link" href={linkURL}>
                <ExternalLinkText>{getHostname(linkURL)}</ExternalLinkText>
              </ExternalLink>
            )}
          </div>
        )}
        {pageCount > 1 && (
          <div className="gallery-viewer__counter">
            {page + 1} of {pageCount}
          </div>
        )}
      </div>
      <button className="gallery-viewer__close-btn" onClick={onClose}>
        <CrossIcon height="22" />
      </button>
    </div>
  );
}
