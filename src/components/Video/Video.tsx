import React, { useState, useRef, useLayoutEffect } from "react";
import Hls from "hls.js";
import type { MediaPlaybackStatus } from "@types";

import { AspectRatio } from "../AspectRatio/AspectRatio";
import { PlayButton } from "../PlayButton/PlayButton";
import { MediaProgress } from "./MediaProgress";
import "./Video.scss";

type VideoProps = {
  height: number;
  isHLS?: boolean;
  poster?: string;
  src: string;
  status?: MediaPlaybackStatus;
  width: number;
};

export function Video({
  height,
  isHLS,
  poster,
  src,
  status = "stopped",
  width,
}: VideoProps) {
  const isPlaying = status == "playing";
  const isPaused = status == "paused";
  const isStopped = status == "stopped";

  const [canPlay, setCanPlay] = useState(false);
  const [controls, setControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const renderVideo = isPlaying || (isPaused && canPlay);

  const posterElem = poster ? (
    <img className="video__fill video__poster" src={poster} />
  ) : (
    <svg
      className="video__fill video__placeholder"
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect x="0" y="0" width="100%" height="100%" />
    </svg>
  );

  if (isStopped) {
    if (canPlay) setCanPlay(false);
    if (duration) setDuration(0);
  }

  if (!isPlaying && controls) {
    setControls(false);
  }

  useLayoutEffect(() => {
    const video = videoRef.current;
    let hls: Hls | undefined;

    if (!renderVideo || !video) return;

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

    return () => {
      video.src = "";
      hls?.destroy();
    };
  }, [isHLS, renderVideo, src]);

  useLayoutEffect(() => {
    if (isPlaying) {
      videoRef.current?.play().catch((error: Error) => {
        if (error.name != "AbortError") throw error;
      });
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <AspectRatio ratio={width / height}>
      <div className="video">
        {!canPlay && posterElem}
        {renderVideo && (
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
        {isPlaying && canPlay && duration >= 10 && (
          <div className="video__progress">
            <MediaProgress mediaRef={videoRef} />
          </div>
        )}
        {(!isPlaying || !canPlay) && (
          <button className="video__fill video__play-button">
            <PlayButton loading={isPlaying} />
          </button>
        )}
      </div>
    </AspectRatio>
  );
}
