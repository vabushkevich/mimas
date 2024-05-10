import React from "react";
import classNames from "classnames";
import { useTransitionState } from "@hooks";

import "./ScaleFade.scss";

export function ScaleFade({
  initialScale = 0.95,
  transformOrigin,
  unmountOnHide,
  children,
  ...restProps
}: {
  in?: boolean;
  initialScale?: number;
  transformOrigin?: string;
  unmountOnHide?: boolean;
  children: React.ReactNode;
}) {
  const { shouldMount, status } = useTransitionState({
    duration: 100,
    in: restProps.in,
  });

  if (unmountOnHide && !shouldMount) return null;

  return (
    <div
      className={classNames(
        "scale-fade",
        `scale-fade--${status}`,
        !shouldMount && "scale-fade--hidden",
      )}
      style={
        {
          "--scale": initialScale,
          "--transform-origin": transformOrigin,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
