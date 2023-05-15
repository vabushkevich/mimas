import React, { useMemo } from "react";
import classNames from "classnames";
import { random } from "lodash-es";

import "./Skeleton.scss";

type SkeletonProps = {
  block?: boolean;
  circle?: boolean;
  height?: number | string;
  roundCorners?: boolean;
  rows?: number;
  width?: number | string;
};

export function Skeleton({
  block,
  circle,
  height,
  roundCorners = true,
  rows,
  width,
}: SkeletonProps) {
  const rowWidths = useMemo(() => {
    if (!rows) return [];
    return new Array(rows).fill(0).map(() => random(90, 100));
  }, [rows]);

  if (rows) {
    return (
      <>
        {rowWidths.map((width, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: `${width}%` }}
          ></div>
        ))}
      </>
    );
  }

  return (
    <div
      className={classNames(
        "skeleton",
        block && "skeleton--block",
        circle && "skeleton--circle",
        roundCorners && "skeleton--round-corners",
      )}
      style={{
        width,
        height: block ? height : undefined,
        lineHeight: !block ? height : undefined,
      }}
    ></div>
  );
}
