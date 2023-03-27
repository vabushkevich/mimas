import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";

import "./Video.scss";

type VideoProps = {
  hls?: boolean;
  poster?: string;
  src: string;
};

export function Video({ hls, poster, src }: VideoProps) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (!started) return;

    const video = ref.current;

    if (!hls) {
      video.src = src;
      video.play();
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    video.play();
  }, [hls, src, started]);

  return (
    <div className="video">
      <video
        ref={ref}
        controls={started}
        loop
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
