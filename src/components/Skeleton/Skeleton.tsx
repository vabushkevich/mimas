import React, { useMemo } from "react";
import classNames from "classnames";
import { random } from "lodash-es";

import "./Skeleton.scss";

type SkeletonProps = {
  circle?: boolean;
  height?: number | string;
  rows?: number;
  width?: number | string;
};

export function Skeleton({
  circle,
  height,
  rows,
  width,
}: SkeletonProps) {
  const rowWidths = useMemo(() => {
    if (!rows) return [];
    return new Array(rows).fill(0).map(() => random(90, 100));
  }, [rows]);

  if (rows) return (
    <div className="skeleton-rows">
      {rowWidths.map((width, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: `${width}%` }}
        ></div>
      ))}
    </div>
  );

  return (
    <div
      className={classNames(
        "skeleton",
        circle && "skeleton--circle",
      )}
      style={{ width, height }}
    ></div>
  );
}
