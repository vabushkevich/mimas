import { MouseEvent } from "react";

const commentSortingOptions = [
  "confidence",
  "top",
  "new",
  "controversial",
  "old",
  "random",
  "qa",
  "live",
] as const;

export const postFeedSortingOptions = [
  "best",
  "hot",
  "new",
  "top",
  "rising",
  "controversial",
] as const;

export const commentFeedSortingOptions = [
  "hot",
  "new",
  "top",
  "controversial",
] as const;

const idPrefixes = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;

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
  bookmarked: boolean;
  commentCount: number;
  dateCreated: number;
  dateEdited?: number;
  id: string;
  locked: boolean;
  pinnedIn: FeedType[];
  score: number;
  subreddit: string;
  subredditId: string;
  title: string;
  url: string;
  userId?: string;
  userName: string;
  voteDirection: VoteDirection;
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
  gallery: Gallery;
};

export type VideoPost = BasePost & {
  type: "video";
  height: number;
  hlsURL: string;
  previewVariants: Media[];
  width: number;
};

export type ImagePost = BasePost & {
  type: "image";
  imageVariants: Media[];
};

export type GIFPost = BasePost & {
  type: "gif";
  previewVariants: Media[];
  videoVariants: Media[];
};

export type YouTubePost = BasePost & {
  type: "youtube";
  videoId: string;
};

export type CrossPost = BasePost & {
  type: "crosspost";
  crossPostUserId?: string;
  crossPostUserName: string;
  parent: Post;
};

export type RemovedPost = BasePost & {
  type: "removed";
  removalReason:
    | "rules-violation"
    | "spam"
    | "author"
    | "moderator"
    | "copyright"
    | "mod-approval"
    | "community";
};

export type Post =
  | ImagePost
  | VideoPost
  | GalleryPost
  | LinkPost
  | TextPost
  | GIFPost
  | YouTubePost
  | CrossPost
  | RemovedPost;

export type PostProps<T extends BasePost> = {
  collapsed?: boolean;
  hideFooter?: boolean;
  pinned?: boolean;
  post: T;
  primaryAuthorType?: AuthorType;
  titleClickable?: boolean;
  onCommentsButtonClick?: (event: MouseEvent) => void;
};

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
  postId: string;
  postTitle: string;
  postUrl: string;
  score: number;
  scoreHidden: boolean;
  userId?: string;
  userName: string;
  voteDirection: VoteDirection;
};

export type Submission = Post | Comment;

export type CommentThreadList = {
  comments: Record<string, Comment>;
  moreComments?: MoreItems;
  rootCommentIds: string[];
};

export type MoreItems = {
  ids: string[];
  parentId: string;
  totalCount: number;
};

export type CommentSortingOption = (typeof commentSortingOptions)[number];

export type PostFeedSortingOption = (typeof postFeedSortingOptions)[number];

export type CommentFeedSortingOption =
  (typeof commentFeedSortingOptions)[number];

export type FeedSortingOption =
  | PostFeedSortingOption
  | CommentFeedSortingOption;

export type User = {
  avatar: string;
  commentKarma: number;
  dateCreated: number;
  description?: string;
  id: string;
  name: string;
  postKarma: number;
};

export type SubmissionDistinction = "moderator" | "admin";

export type BaseSubreddit = {
  avatar?: string;
  dateCreated: number;
  description?: string;
  id: string;
  name: string;
  private: boolean;
  subscribed: boolean;
};

export type PublicSubreddit = BaseSubreddit & {
  activeUserCount?: number;
  private: false;
  subscribers: number;
};

export type PrivateSubreddit = BaseSubreddit & {
  private: true;
};

export type Subreddit = PublicSubreddit | PrivateSubreddit;

export type IdPrefix = (typeof idPrefixes)[number];

export type IdType =
  | "comment"
  | "user"
  | "post"
  | "message"
  | "subreddit"
  | "award";

export type AuthorType = "user" | "subreddit";

export type FeedType = AuthorType | "mixed";

export type SortTimeInterval = (typeof sortTimeIntervals)[number];

export function isCommentSortingOption(
  value: any,
): value is CommentSortingOption {
  return commentSortingOptions.includes(value);
}

export function isPostFeedSortingOption(
  value: any,
): value is PostFeedSortingOption {
  return postFeedSortingOptions.includes(value);
}

export function isCommentFeedSortingOption(
  value: any,
): value is CommentFeedSortingOption {
  return commentFeedSortingOptions.includes(value);
}

export function isIdPrefix(value: any): value is IdPrefix {
  return idPrefixes.includes(value);
}

export function isSortTimeInterval(value: any): value is SortTimeInterval {
  return sortTimeIntervals.includes(value);
}

export function isSortRequiresTimeInterval(sort: FeedSortingOption) {
  return sort === "top" || sort === "controversial";
}

export type Identity = {
  user: User;
};

export type VoteDirection = -1 | 0 | 1;

export type Media = {
  height: number;
  src: string;
  width: number;
};

export type Gallery = {
  items: {
    caption?: string;
    id: string;
    imageVariants: Media[];
  }[];
};

export type ColorMode = "dark" | "light" | "system";
