export type PostRaw = {
  data: {
    author: string;
    created_utc: number;
    gallery_data?: {
      items: {
        media_id: string;
      }[];
    };
    is_video: boolean;
    media_metadata?: Record<string, {
      p: {
        u: string;
        x: number;
        y: number;
      }[];
      s: {
        u: string;
      };
    }>;
    media: null | {
      reddit_video?: {
        fallback_url: string;
      };
    };
    name: string;
    num_comments: number;
    permalink: string;
    post_hint?: "image";
    preview?: {
      images: {
        resolutions: {
          url: string;
          width: number;
          height: number;
        }[];
      }[];
    };
    score: number;
    selftext_html: string | null;
    subreddit: string;
    title: string;
    url_overridden_by_dest?: string;
  };
};

export type SubredditData = {
  community_icon: string;
  icon_img: string;
};

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

export type CommentRaw = {
  data: {
    author_fullname?: string;
    author: string;
    body_html: string;
    body: string;
    created_utc: number;
    distinguished: "moderator" | "admin" | null;
    edited: number | false;
    is_submitter: boolean;
    locked: boolean;
    name: string;
    parent_id: string;
    replies: "" | {
      data: {
        children: (CommentRaw | MoreItemsRaw)[];
      };
    };
    score_hidden: boolean;
    score: number;
    stickied: boolean;
  };
  kind: "t1";
};

export type MoreItemsRaw = {
  data: {
    children: string[];
    count: number;
    parent_id: string;
  };
  kind: "more";
};

export type Comment = {
  avatar?: string;
  bodyHtml: string;
  bodyText: string;
  byAdmin: boolean;
  byModerator: boolean;
  bySubmitter: boolean;
  dateCreated: number;
  dateEdited: number;
  deleted: boolean;
  deletedBy?: "user" | "moderator";
  id: string;
  locked: boolean;
  pinned: boolean;
  score: number;
  scoreHidden: boolean;
  userId: string | null;
  userName: string;
};

export type CommentThread = {
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

export type UserRaw = {
  profile_img: string;
};

export type User = {
  avatar: string;
  id: string;
};
