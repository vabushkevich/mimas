import React from "react";
import { PostData } from "@types";
import { decodeEntities } from "@utils";

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
    return <ImagePost {...props} image={postData.url_overridden_by_dest} />
  }
  if (isVideoPost(postData)) {
    const video = postData.media.reddit_video.fallback_url;
    return <VideoPost {...props} video={video} />;
  }
  if (isGalleryPost(postData)) {
    const images = postData.gallery_data.items.reduce((out, item) => {
      const url = decodeEntities(postData.media_metadata[item.media_id].s.u);
      out.push(url);
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
