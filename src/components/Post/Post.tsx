import React from "react";
import { PostData } from "@types";
import { decodeEntities } from "@utils";

import { BasePost, LinkPost, TextPost } from "@components";

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
