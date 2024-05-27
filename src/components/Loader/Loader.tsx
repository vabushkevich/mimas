import React from "react";
import classNames from "classnames";

import "./Loader.scss";

type LoaderProps = {
  color?: "black" | "white";
  size?: "sm" | "md" | "lg";
};

export function Loader({ color, size = "md" }: LoaderProps) {
  return (
    <div
      className={classNames(
        "loader",
        color && `loader--color_${color}`,
        `loader--size_${size}`,
      )}
    >
      <div className="loader__dot"></div>
      <div className="loader__dot"></div>
      <div className="loader__dot"></div>
    </div>
  );
}
