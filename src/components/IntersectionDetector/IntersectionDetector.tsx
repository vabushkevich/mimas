import React, { useRef, useEffect } from "react";

type IntersectionDetectorProps = {
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  onIntersect: () => void;
  children?: React.ReactNode;
};

export function IntersectionDetector({
  marginLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  onIntersect,
  children,
}: IntersectionDetectorProps) {
  const onIntersectRef = useRef<typeof onIntersect>();
  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const isIntersecting = () => {
      if (!elemRef.current) return;
      const elemRect = elemRef.current.getBoundingClientRect();
      const { clientWidth, clientHeight } = document.documentElement;
      return (
        elemRect.right + marginRight > 0 &&
        elemRect.left - marginLeft < clientWidth &&
        elemRect.bottom + marginBottom > 0 &&
        elemRect.top - marginTop < clientHeight
      );
    };

    const checkEnter = () => {
      if (!isIntersecting()) return;
      onIntersectRef.current?.();
      document.removeEventListener("scroll", checkEnter);
      document.addEventListener("scroll", checkLeave);
    };

    const checkLeave = () => {
      if (isIntersecting()) return;
      document.removeEventListener("scroll", checkLeave);
      document.addEventListener("scroll", checkEnter);
    };

    document.addEventListener("scroll", checkEnter);
    checkEnter();

    return () => {
      document.removeEventListener("scroll", checkEnter);
      document.removeEventListener("scroll", checkLeave);
    };
  }, []);

  return <div ref={elemRef}>{children}</div>;
}
