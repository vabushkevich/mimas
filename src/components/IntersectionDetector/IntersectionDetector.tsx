import React, { useEffect, useRef } from "react";
import { useInView } from "@hooks";

type IntersectionDetectorProps = {
  rootMargin?: string;
  threshold?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  onEnter,
  onLeave,
  children,
  ...restProps
}: IntersectionDetectorProps) {
  const savedCallbacks = useRef({ onEnter, onLeave });
  useEffect(() => {
    savedCallbacks.current = { onEnter, onLeave };
  });

  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, restProps);
  useEffect(() => {
    if (isInView) savedCallbacks.current.onEnter?.();
    return () => {
      if (isInView) savedCallbacks.current.onLeave?.();
    };
  }, [isInView]);

  return <div ref={ref}>{children}</div>;
}
