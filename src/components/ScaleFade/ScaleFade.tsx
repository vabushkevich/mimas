import React, { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { afterPaint } from "@utils";

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
  const shouldBeHidden = !restProps.in;
  const [isHidden, setIsHidden] = useState(shouldBeHidden);
  const [isVisuallyHidden, setIsVisuallyHidden] = useState(shouldBeHidden);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isHidden) {
      // When the `hidden` class is removed, it is necessary to remove the
      // `visually-hidden` class after repaint to make the transition happen
      afterPaint(() => setIsVisuallyHidden(shouldBeHidden));
    } else if (!shouldBeHidden) {
      setIsHidden(false);
    }
  }, [isHidden, shouldBeHidden]);

  if (unmountOnHide && isHidden) return null;

  return (
    <div
      className={classNames(
        "scale-fade",
        isHidden && "scale-fade--hidden",
        isVisuallyHidden && "scale-fade--visually-hidden",
      )}
      ref={ref}
      style={
        {
          "--scale": initialScale,
          "--transform-origin": transformOrigin,
        } as React.CSSProperties
      }
      onTransitionEnd={(event) => {
        if (
          event.target == ref.current &&
          event.propertyName == "opacity" &&
          isVisuallyHidden
        ) {
          setIsHidden(true);
        }
      }}
    >
      {children}
    </div>
  );
}
