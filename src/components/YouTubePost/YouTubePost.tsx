import React, { useState } from "react";
import classNames from "classnames";
import type { YouTubePost, PostProps } from "@types";

import { BasePost } from "../BasePost/BasePost";
import { PlayButton } from "../PlayButton/PlayButton";
import { YouTubeThumbnail } from "./YouTubeThumbnail";
import YouTubeIcon from "./assets/youtube-play.svg";
import "./YouTubePost.scss";

export function YouTubePost(props: PostProps<YouTubePost>) {
  const { videoId } = props.post;
  const [started, setStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  return (
    <BasePost {...props}>
      <div className="youtube-post-body">
        {(!started || !canPlay) && (
          <>
            <div className="youtube-post-body__thumbnail">
              <YouTubeThumbnail videoId={videoId} />
            </div>
            <button
              className="youtube-post-body__play-btn"
              onClick={() => setStarted(true)}
            >
              {started ? <PlayButton loading /> : <YouTubeIcon height="48" />}
            </button>
          </>
        )}
        {started && (
          <iframe
            className={classNames(
              "youtube-post-body__video",
              !canPlay && "youtube-post-body__video--hidden",
            )}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={() => setCanPlay(true)}
          ></iframe>
        )}
      </div>
    </BasePost>
  );
}
