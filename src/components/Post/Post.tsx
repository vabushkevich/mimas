import React from "react";
import type { Post } from "@types";

import {
  LinkPost,
  TextPost,
  GalleryPost,
  VideoPost,
  ImagePost,
} from "@components";

type PostProps = Post & {
  collapsed?: boolean;
};

export function Post(props: PostProps) {
  switch (props.type) {
    case "gallery":
      return <GalleryPost {...props} />;
    case "image":
      return <ImagePost {...props} />;
    case "link":
      return <LinkPost {...props} />;
    case "text":
      return (
        <TextPost
          {...props}
          collapsed={props.collapsed ?? props.bodyHtml.length > 500}
        />
      );
    case "video":
      return <VideoPost {...props} />;
  }
}
