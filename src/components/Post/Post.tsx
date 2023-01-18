import React, { useState, useContext, useEffect } from "react";
import type { Post } from "@types";
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
      if (props.subreddit) {
        const subreddit = await client.getSubreddit(props.subredditId);
        setAvatar(subreddit.avatar);
      } else {
        const user = await client.getUser(props.userName);
        setAvatar(user.avatar);
      }
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
