import React from "react";
import { PostData } from "@types";

import { BasePost, LinkPost } from "@components";

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

  if (isLinkPost(postData)) {
    return <LinkPost {...props} linkUrl={postData.url_overridden_by_dest} />;
  }
  return <BasePost {...props} />;
}
