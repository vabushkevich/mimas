import React from "react";

import "./AspectRatio.scss";

type AspectRatioProps = {
  ratio: number;
  children?: React.ReactNode;
};

export function AspectRatio({ ratio, children }: AspectRatioProps) {
  return (
    <div className="aspect-ratio">
      <div className="aspect-ratio__body">{children}</div>
      <div
        className="aspect-ratio__expander"
        style={{ paddingTop: `${100 / ratio}%` }}
      ></div>
    </div>
  );
}
