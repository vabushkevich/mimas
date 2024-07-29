import React, { useEffect, useRef } from "react";
import { useIntersectionDetector } from "@hooks";

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

  const isIntersecting = useIntersectionDetector({ ref, ...restProps });
  useEffect(() => {
    if (isIntersecting) savedCallbacks.current.onEnter?.();
    return () => {
      if (isIntersecting) savedCallbacks.current.onLeave?.();
    };
  }, [isIntersecting]);

  return <div ref={ref}>{children}</div>;
}
