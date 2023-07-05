import React from "react";
import type { ColorMode } from "@types";

import "./Loader.scss";

type LoaderProps = {
  colorMode?: ColorMode;
  size?: "sm" | "md" | "lg";
};

export function Loader({ colorMode = "system", size = "md" }: LoaderProps) {
  return (
    <div
      className={[
        "loader",
        `loader--color-mode_${colorMode}`,
        `loader--size_${size}`,
      ].join(" ")}
    >
      <div className="loader__dot"></div>
      <div className="loader__dot"></div>
      <div className="loader__dot"></div>
    </div>
  );
}
