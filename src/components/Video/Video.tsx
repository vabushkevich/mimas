import React, { useState, useRef, useLayoutEffect } from "react";
import Hls from "hls.js";
import classNames from "classnames";

import { AspectRatio, PlayButton } from "@components";
import { MediaProgress } from "./MediaProgress";
import "./Video.scss";

type VideoProps = {
  height: number;
  isHLS?: boolean;
  poster?: string;
  src: string;
  started?: boolean;
  width: number;
};

function getPlaceholderImage(width: number, height: number) {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;
}

export function Video({
  height,
  isHLS,
  poster,
  src,
  started,
  width,
}: VideoProps) {
  const [canPlay, setCanPlay] = useState(false);
  const [controls, setControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!started) {
    if (canPlay) setCanPlay(false);
    if (controls) setControls(false);
    if (duration) setDuration(0);
  }

  useLayoutEffect(() => {
    const video = videoRef.current;
    let hls: Hls | undefined;

    if (!started || !video) return;

    if (isHLS && Hls.isSupported()) {
      hls = new Hls({ startLevel: Infinity });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    video.play().catch((error) => {
      if (videoRef.current) throw error;
    });

    return () => {
      if (videoRef.current) videoRef.current.src = "";
      hls?.destroy();
    };
  }, [isHLS, src, started]);

  return (
    <AspectRatio ratio={width / height}>
      <div className="video">
        {(!started || !canPlay) && (
          <>
            <img
              className={classNames(
                "video__poster",
                !poster && "video__poster--placeholder",
                "video__fill",
              )}
              src={poster || getPlaceholderImage(width, height)}
            />
            <button className="video__play-button video__fill">
              <PlayButton loading={started} />
            </button>
          </>
        )}
        {started && (
          <video
            className="video__fill"
            style={!canPlay ? { visibility: "hidden" } : {}}
            ref={videoRef}
            controls={controls}
            loop
            muted
            playsInline
            onCanPlay={() => setCanPlay(true)}
            onClick={() => setControls(true)}
            onDurationChange={() =>
              setDuration(videoRef.current?.duration || 0)
            }
            onMouseOver={() => setControls(true)}
          ></video>
        )}
        {canPlay && duration >= 10 && (
          <div className="video__progress">
            <MediaProgress mediaRef={videoRef} />
          </div>
        )}
      </div>
    </AspectRatio>
  );
}
