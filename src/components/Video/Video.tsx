import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import classNames from "classnames";

import { PlayButton } from "@components";
import "./Video.scss";

type VideoProps = {
  height: number;
  isHLS?: boolean;
  poster?: string;
  src: string;
  width: number;
};

function getPlaceholderImage(width: number, height: number) {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;
}

export function Video({ height, isHLS, poster, src, width }: VideoProps) {
  const [started, setStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [controls, setControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!started || !video) return;

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({ startLevel: Infinity });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    video.play().catch((error) => {
      if (videoRef.current) throw error;
    });
  }, [isHLS, src, started]);

  useEffect(() => {
    if (!started || !videoRef.current) return;
    videoRef.current.onmouseover = videoRef.current.onclick = () => {
      setControls(true);
    };
  }, [started]);

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
            style={!canPlay ? { visibility: "hidden" } : {}}
            ref={videoRef}
            controls={controls}
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
