import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";

import "./Video.scss";

type VideoProps = {
  poster?: string;
  src: string;
  onClick?: () => void;
};

export function Video({ poster, src }: VideoProps) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (!started) return;

    const video = ref.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    video.play();
  }, [started]);

  return (
    <div className="video">
      <video
        ref={ref}
        controls={started}
        muted
        playsInline
        poster={poster}
        preload="none"
      ></video>
      {!started && (
        <button
          className="video__play-btn"
          onClick={() => setStarted(true)}
        ></button>
      )}
    </div>
  );
}
