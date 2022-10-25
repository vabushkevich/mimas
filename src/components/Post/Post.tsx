import React from "react";
import { PostData } from "@types";
import { decodeEntities } from "@utils";
import { findLast } from "lodash-es";

import {
  BasePost,
  LinkPost,
  TextPost,
  GalleryPost,
  VideoPost,
  ImagePost,
} from "@components";

type PostProps = {
  postData: PostData;
};

function isLinkPost({ url_overridden_by_dest }: PostData) {
  if (!url_overridden_by_dest) return false;
  switch (new URL(url_overridden_by_dest).hostname) {
    case "www.reddit.com":
    case "i.redd.it":
    case "v.redd.it":
      return false;
  }
  return true;
}

function isTextPost({ selftext_html }: PostData) {
  return typeof selftext_html == "string";
}

function isGalleryPost(postData: PostData) {
  return "gallery_data" in postData;
}

function isVideoPost({ is_video }: PostData) {
  return is_video === true;
}

function isImagePost({ post_hint }: PostData) {
  return post_hint === "image";
}

export function Post({ postData }: PostProps) {
  const props = {
    commentCount: postData.num_comments,
    dateCreated: postData.created_utc * 1000,
    id: postData.name,
    score: postData.score,
    subreddit: postData.subreddit,
    title: postData.title,
    url: `https://www.reddit.com${postData.permalink}`,
    userName: postData.author,
  };

  if (isImagePost(postData)) {
    const images = postData.preview.images[0].resolutions;
    const image = findLast(images, (item) => item.width <= 640);
    return <ImagePost {...props} image={decodeEntities(image.url)} />
  }

  if (isVideoPost(postData)) {
    const video = postData.media.reddit_video.fallback_url;
    return <VideoPost {...props} video={video} />;
  }

  if (isGalleryPost(postData)) {
    const images = postData.gallery_data.items.reduce((out, item) => {
      const images = postData.media_metadata[item.media_id].p;
      const image = findLast(images, (item) => item.x <= 640);
      out.push(decodeEntities(image.u));
      return out;
    }, []);
    return <GalleryPost {...props} images={images} />;
  }

  if (isTextPost(postData)) {
    const contentHtml = decodeEntities(postData.selftext_html);
    return (
      <TextPost
        {...props}
        contentHtml={contentHtml}
        collapsed={contentHtml.length > 500}
      />
    );
  }

  if (isLinkPost(postData)) {
    return <LinkPost {...props} linkUrl={postData.url_overridden_by_dest} />;
  }
  
  return <BasePost {...props} />;
}
