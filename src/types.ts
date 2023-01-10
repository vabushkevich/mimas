export type BasePost = {
  archived: boolean;
  avatar: string;
  commentCount: number;
  dateCreated: number;
  id: string;
  locked: boolean;
  removalReason?: "rules-violation" | "spam" | "user" | "moderator";
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
  childIds: string[];
  dateCreated: number;
  dateEdited?: number;
  deletedBy?: "user" | "moderator";
  depth: number;
  distinction?: "moderator" | "admin";
  id: string;
  locked: boolean;
  moreChildren?: MoreItems;
  parentId: string;
  pinned: boolean;
  score: number;
  scoreHidden: boolean;
  userId?: string;
  userName: string;
};

export type CommentThreadList = {
  comments: Record<string, Comment>;
  moreComments?: MoreItems;
};

export type MoreItems = {
  ids: string[];
  parentId?: string;
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

export type PostSortingMethod =
  | "best"
  | "hot"
  | "new"
  | "top"
  | "rising";

export type User = {
  avatar: string;
  id: string;
};
