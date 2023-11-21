import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import classNames from "classnames";

import { PlayButton } from "@components";
import "./Video.scss";

type VideoProps = {
  height: number;
  hls?: boolean;
  poster?: string;
  src: string;
  width: number;
};

function getPlaceholderImage(width: number, height: number) {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;
}

export function Video({ height, hls, poster, src, width }: VideoProps) {
  const [started, setStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!started || !video) return;

    if (!hls) {
      video.src = src;
      video.play();
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ startLevel: Infinity });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    video.play();
  }, [hls, src, started]);

  return (
    <div className="video">
      <div className="video__container">
        {(!started || !canPlay) && (
          <>
            <img
              className={classNames(
                "video__poster",
                !poster && "video__poster--placeholder",
              )}
              src={poster || getPlaceholderImage(width, height)}
            />
            <button
              className="video__play-button"
              onClick={() => setStarted(true)}
            >
              <PlayButton loading={started} />
            </button>
          </>
        )}
        {started && (
          <video
            className={classNames(
              "video__video",
              !canPlay && "video__video--hidden",
            )}
            ref={videoRef}
            controls
            loop
            muted
            playsInline
            onCanPlay={() => setCanPlay(true)}
          ></video>
        )}
      </div>
      <div
        style={{
          paddingTop: `${(100 * height) / width}%`,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}
