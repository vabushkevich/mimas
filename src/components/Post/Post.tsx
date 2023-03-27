import React from "react";
import type { Post, PostProps } from "@types";

import {
  LinkPost,
  TextPost,
  GalleryPost,
  VideoPost,
  ImagePost,
  GIFPost,
} from "@components";

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
  }
}
