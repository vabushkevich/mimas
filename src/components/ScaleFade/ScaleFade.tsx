import React from "react";
import classNames from "classnames";
import { useTransitionState } from "@hooks";

import "./ScaleFade.scss";

export function ScaleFade({
  in: inProp,
  initialScale = 0.95,
  transformOrigin,
  unmountOnExit,
  children,
}: {
  in?: boolean;
  initialScale?: number;
  transformOrigin?: string;
  unmountOnExit?: boolean;
  children: React.ReactNode;
}) {
  const duration = 100;
  const { shouldMount, status } = useTransitionState({ duration, in: inProp });

  if (unmountOnExit && !shouldMount) return null;

  return (
    <div
      className={classNames(
        "scale-fade",
        `scale-fade--${status}`,
        !shouldMount && "scale-fade--hidden",
      )}
      style={
        {
          "--duration": `${duration}ms`,
          "--scale": initialScale,
          "--transform-origin": transformOrigin,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
