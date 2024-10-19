import React from "react";
import type { Post, PostProps } from "@types";

import { CrossPost } from "../CrossPost/CrossPost";
import { GalleryPost } from "../GalleryPost/GalleryPost";
import { GIFPost } from "../GIFPost/GIFPost";
import { ImagePost } from "../ImagePost/ImagePost";
import { LinkPost } from "../LinkPost/LinkPost";
import { RemovedPost } from "../RemovedPost/RemovedPost";
import { TextPost } from "../TextPost/TextPost";
import { VideoPost } from "../VideoPost/VideoPost";
import { YouTubePost } from "../YouTubePost/YouTubePost";

export function Post({ post, ...rest }: PostProps<Post>) {
  switch (post.type) {
    case "gallery":
      return <GalleryPost post={post} {...rest} />;
    case "image":
      return <ImagePost post={post} {...rest} />;
    case "link":
      return <LinkPost post={post} {...rest} />;
    case "text":
      return <TextPost post={post} {...rest} />;
    case "video":
      return <VideoPost post={post} {...rest} />;
    case "gif":
      return <GIFPost post={post} {...rest} />;
    case "youtube":
      return <YouTubePost post={post} {...rest} />;
    case "crosspost":
      return <CrossPost post={post} {...rest} />;
    case "removed":
      return <RemovedPost post={post} {...rest} />;
  }
}
