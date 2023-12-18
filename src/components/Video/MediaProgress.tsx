import React, { useEffect, useRef } from "react";

import "./MediaProgress.scss";

type MediaProgressProps = {
  mediaRef: React.RefObject<HTMLMediaElement>;
};

export function MediaProgress({ mediaRef }: MediaProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    const bar = barRef.current;
    let prevTime = 0;

    if (!media || !bar) return;

    const step = () => {
      const timeStep = Math.min(0.33, Math.abs(media.currentTime - prevTime));
      const progress = media.currentTime / media.duration;
      prevTime = media.currentTime;
      // Force recalculate style to ensure that previous transition disabling
      // will take effect
      getComputedStyle(bar).transition;
      bar.style.transition = "";
      bar.style.transitionDuration = `${timeStep}s`;
      bar.style.width = `${progress * 100}%`;
    };

    const sync = () => {
      const progress = media.currentTime / media.duration;
      bar.style.transition = "none";
      bar.style.width = `${progress * 100}%`;
    };

    media.addEventListener("timeupdate", step);
    media.addEventListener("seeking", sync);

    return () => {
      media.removeEventListener("timeupdate", step);
      media.removeEventListener("seeking", sync);
    };
  }, [mediaRef.current]);

  return (
    <div className="media-progress">
      <div className="media-progress__made" ref={barRef}></div>
      <div className="media-progress__left"></div>
    </div>
  );
}
