const commentSortingMethods = [
  "confidence",
  "top",
  "new",
  "controversial",
  "old",
  "random",
  "qa",
  "live",
] as const;

const postSortingMethods = [
  "best",
  "hot",
  "new",
  "top",
  "rising",
  "controversial",
] as const;

const idPrefixes = [
  "t1",
  "t2",
  "t3",
  "t4",
  "t5",
  "t6",
] as const;

const sortTimeIntervals = [
  "hour",
  "day",
  "week",
  "month",
  "year",
  "all",
] as const;

export type BasePost = {
  archived: boolean;
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
  userId?: string;
  userName: string;
  vote?: "up" | "down";
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
  rootCommentIds: string[];
};

export type MoreItems = {
  ids: string[];
  parentId?: string;
  totalCount: number;
};

export type CommentSortingMethod = typeof commentSortingMethods[number];

export type PostSortingMethod = typeof postSortingMethods[number];

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
  activeUserCount: number;
  avatar: string;
  dateCreated: number;
  description: string;
  id: string;
  name: string;
  subscribers: number;
};

export type IdPrefix = typeof idPrefixes[number];

export type IdType =
  | "comment"
  | "user"
  | "post"
  | "message"
  | "subreddit"
  | "award";

export type AuthorType = "user" | "subreddit";

export type SortTimeInterval = typeof sortTimeIntervals[number];

export function isCommentSortingMethod(
  value: any,
): value is CommentSortingMethod {
  return commentSortingMethods.includes(value);
}

export function isPostSortingMethod(
  value: any,
): value is PostSortingMethod {
  return postSortingMethods.includes(value);
}

export function isIdPrefix(
  value: any,
): value is IdPrefix {
  return idPrefixes.includes(value);
}

export function isSortTimeInterval(
  value: any,
): value is SortTimeInterval {
  return sortTimeIntervals.includes(value);
}

export function isSortRequiresTimeInterval(sort: PostSortingMethod) {
  return sort === "top" || sort === "controversial";
}

export type FeedPageType = "user" | "all" | "popular";

export type MenuItem = {
  content: React.ReactNode;
  value: string;
};

export type Identity = {
  user: User;
};
