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
