import React, { useRef, useEffect } from "react";

type IntersectionDetectorProps = {
  rootMargin?: string;
  threshold?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  rootMargin,
  threshold,
  onEnter,
  onLeave,
  children,
}: IntersectionDetectorProps) {
  const callbacksRef = useRef({ onEnter, onLeave });
  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callbacksRef.current = { onEnter, onLeave };
  }, [onEnter, onLeave]);

  useEffect(() => {
    if (!elemRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((entry) => entry.target == elemRef.current);
        if (!entry) return;
        callbacksRef.current[entry.isIntersecting ? "onEnter" : "onLeave"]?.();
      },
      { rootMargin, threshold },
    );
    observer.observe(elemRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={elemRef}>{children}</div>;
}
