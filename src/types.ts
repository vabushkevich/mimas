export interface PostData {
  author: string;
  created_utc: number;
  name: string;
  num_comments: number;
  permalink: string;
  score: number;
  subreddit: string;
  title: string;
  url_overridden_by_dest?: string;
}

export interface BasePost {
  commentCount: number;
  dateCreated: number;
  id: string;
  score: number;
  subreddit: string;
  title: string;
  url: string;
  userName: string;
}

export interface LinkPost extends BasePost {
  linkUrl: string;
}

export type Post = LinkPost;
