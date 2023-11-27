import React, { useRef, useEffect } from "react";

type IntersectionDetectorProps = {
  rootMargin?: string;
  onEnter?: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  rootMargin,
  onEnter,
  children,
}: IntersectionDetectorProps) {
  const onEnterRef = useRef<typeof onEnter>();
  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (!elemRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some(
          (entry) => entry.target == elemRef.current && entry.isIntersecting,
        );
        if (isIntersecting) onEnterRef.current?.();
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
