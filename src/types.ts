export type BasePost = {
  archived: boolean;
  avatar: string;
  commentCount: number;
  dateCreated: number;
  dateEdited?: number;
  id: string;
  locked: boolean;
  pinned: boolean;
  removalReason?: "rules-violation" | "spam" | "user" | "moderator";
  score: number;
  subreddit: string;
  subredditId: string;
  title: string;
  url: string;
  userId: string;
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
  distinction?: SubmissionDistinction;
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

export type Submission = Post | Comment;

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
  commentKarma: number;
  dateCreated: number;
  id: string;
  name: string;
  postKarma: number;
};

export type SubmissionDistinction = "moderator" | "admin";

export type Subreddit = {
  avatar: string;
  id: string;
};

export type IdPrefix =
  | "t1"
  | "t2"
  | "t3"
  | "t4"
  | "t5"
  | "t6";

export type IdType =
  | "comment"
  | "user"
  | "post"
  | "message"
  | "subreddit"
  | "award";

export type AuthorType = "user" | "subreddit";
