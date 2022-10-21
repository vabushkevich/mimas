import React, { useState } from "react";
import classNames from "classnames";

import "./Carousel.scss";

type CarouselProps = {
  images: string[];
};

export function Carousel({ images }: CarouselProps) {
  const [page, setPage] = useState(0);

  const goToPage = (page: number) => {
    if (page < 0) {
      page = images.length - 1;
    } else if (page >= images.length) {
      page = 0;
    }
    setPage(page);
  };

  return (
    <div className="carousel">
      <img src={images[page]} className="carousel__item"></img>
      <div className="carousel__controls">
        <button className="carousel__prev-btn" onClick={() => goToPage(page - 1)}></button>
        <div className="carousel__indicators">
          {images.map((url, i) =>
            <button
              key={url}
              className={classNames(
                "carousel__indicator",
                i == page && "carousel__indicator--selected"
              )}
              onClick={() => goToPage(i)}
            >
            </button>
          )}
        </div>
        <button className="carousel__next-btn" onClick={() => goToPage(page + 1)}></button>
      </div>
    </div >
  );
}
