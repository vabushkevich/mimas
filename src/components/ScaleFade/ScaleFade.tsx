import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

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

  useEffect(() => {
    if (isHidden && !shouldBeHidden) {
      setIsHidden(false);
    } else {
      const elem = ref.current;
      setIsVisuallyHidden(shouldBeHidden);
      if (!shouldBeHidden || !elem) return;

      const hideElem = () => setIsHidden(true);
      const handleTransitionEnd = (event: Event) => {
        if (event.target == elem) hideElem();
      };
      const timer = setTimeout(hideElem, 100);
      elem.addEventListener("transitionend", handleTransitionEnd);

      return () => {
        clearTimeout(timer);
        elem.removeEventListener("transitionend", handleTransitionEnd);
      };
    }
  }, [shouldBeHidden]);

  useEffect(() => {
    if (isHidden) return;
    // Force recalculate style to avoid `display: none` affecting transition
    if (ref.current) getComputedStyle(ref.current).display;
    setIsVisuallyHidden(false);
  }, [isHidden]);

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
    >
      {children}
    </div>
  );
}
