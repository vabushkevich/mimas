import React, { useState, useContext, useEffect } from "react";
import { Post } from "@types";
import { ClientContext } from "@context";

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

export function Post(initProps: PostProps) {
  const client = useContext(ClientContext);
  const [avatar, setAvatar] = useState("");
  const props = { ...initProps, avatar };

  useEffect(() => {
    (async () => {
      const subredditData = await client.getSubredditInfo(props.subreddit);
      const avatar = subredditData.community_icon || subredditData.icon_img;
      setAvatar(avatar.split("?")[0]);
    })();
  }, []);

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
