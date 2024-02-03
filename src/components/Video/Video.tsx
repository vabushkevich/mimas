import React, { useState, useRef, useLayoutEffect } from "react";
import Hls from "hls.js";

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
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.once(Hls.Events.MANIFEST_PARSED, () => {
        if (hls) hls.startLevel = hls.levels.length - 1;
      });
    } else {
      video.src = src;
    }

    video.play().catch((error) => {
      if (videoRef.current) throw error;
    });

    return () => {
      video.src = "";
      hls?.destroy();
    };
  }, [isHLS, src, started]);

  return (
    <AspectRatio ratio={width / height}>
      <div className="video">
        {poster ? (
          <img className="video__fill video__poster" src={poster} />
        ) : (
          <svg
            className="video__fill video__placeholder"
            viewBox={`0 0 ${width} ${height}`}
          >
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>
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
        {(!started || !canPlay) && (
          <button className="video__fill video__play-button">
            <PlayButton loading={started} />
          </button>
        )}
      </div>
    </AspectRatio>
  );
}
