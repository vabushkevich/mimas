export type BasePost = {
  avatar: string;
  commentCount: number;
  dateCreated: number;
  id: string;
  score: number;
  subreddit: string;
  title: string;
  url: string;
  userName: string;
};

export type LinkPost = BasePost & {
  type: "link";
  linkUrl: string;
};

export type TextPost = BasePost & {
  type: "text";
  bodyHtml: string;
};

export type GalleryPost = BasePost & {
  type: "gallery";
  images: string[];
};

export type VideoPost = BasePost & {
  type: "video";
  video: string;
};

export type ImagePost = BasePost & {
  type: "image";
  image: string;
};

export type Post = ImagePost | VideoPost | GalleryPost | LinkPost | TextPost;

export type Comment = {
  avatar?: string;
  bodyHtml: string;
  bodyText: string;
  bySubmitter: boolean;
  dateCreated: number;
  dateEdited: number;
  deletedBy?: "user" | "moderator";
  distinction?: "moderator" | "admin";
  id: string;
  locked: boolean;
  pinned: boolean;
  score: number;
  scoreHidden: boolean;
  userId?: string;
  userName: string;
};

export type CommentThread = {
  collapsed: boolean;
  comment: Comment;
  replies: CommentThreadList;
};

export type CommentThreadList = {
  threads: CommentThread[];
  more?: MoreItems;
};

export type MoreItems = {
  ids: string[];
  totalCount: number;
};

export type CommentSortingMethod =
  | "confidence"
  | "top"
  | "new"
  | "controversial"
  | "old"
  | "random"
  | "qa"
  | "live";

export type User = {
  avatar: string;
  id: string;
};
