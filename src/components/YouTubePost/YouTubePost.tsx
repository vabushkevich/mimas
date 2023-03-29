import React, { useState } from "react";
import type { YouTubePost, PostProps } from "@types";

import { BasePost } from "@components";
import { YouTubeThumbnail } from "./YouTubeThumbnail";
import "./YouTubePost.scss";

export function YouTubePost(props: PostProps<YouTubePost>) {
  const { videoId } = props.post;
  const [started, setStarted] = useState(false);

  return (
    <BasePost {...props}>
      <div className="youtube-post-body">
        {started ? (
          <iframe
            className="youtube-post-body__video"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        ) : (
          <>
            <div className="youtube-post-body__thumbnail">
              <YouTubeThumbnail videoId={videoId} />
            </div>
            <button
              className="youtube-post-body__play-btn"
              onClick={() => setStarted(true)}
            ></button>
          </>
        )}
      </div>
    </BasePost>
  );
}
