import React, { useRef } from "react";
import { useIntersectionDetector } from "@hooks";

type IntersectionDetectorProps = {
  rootMargin?: string;
  threshold?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  children,
  ...restProps
}: IntersectionDetectorProps) {
  const ref = useRef<HTMLDivElement>(null);
  useIntersectionDetector({ ref, ...restProps });
  return <div ref={ref}>{children}</div>;
}
