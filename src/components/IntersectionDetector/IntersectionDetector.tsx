import React, { useRef, useEffect } from "react";

type IntersectionDetectorProps = {
  rootMargin?: string;
  onIntersect: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  rootMargin,
  onIntersect,
  children,
}: IntersectionDetectorProps) {
  const onIntersectRef = useRef<typeof onIntersect>();
  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!elemRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some(
          (entry) => entry.target == elemRef.current && entry.isIntersecting,
        );
        if (isIntersecting) onIntersectRef.current?.();
      },
      { rootMargin },
    );
    observer.observe(elemRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={elemRef}>{children}</div>;
}
