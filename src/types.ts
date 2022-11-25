export interface PostRaw {
  data: {
    author: string;
    created_utc: number;
    is_video: boolean;
    media: null | {
      reddit_video?: {
        fallback_url: string;
      };
    };
    name: string;
    num_comments: number;
    permalink: string;
    score: number;
    selftext_html: string | null;
    subreddit: string;
    title: string;
    gallery_data?: {
      items: {
        media_id: string;
      }[];
    };
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
    url_overridden_by_dest?: string;
  };
}

export interface SubredditData {
  community_icon: string;
  icon_img: string;
}

export interface BasePost {
  avatar: string;
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
  type: "link";
  linkUrl: string;
}

export interface TextPost extends BasePost {
  type: "text";
  contentHtml: string;
}

export interface GalleryPost extends BasePost {
  type: "gallery";
  images: string[];
}

export interface VideoPost extends BasePost {
  type: "video";
  video: string;
}

export interface ImagePost extends BasePost {
  type: "image";
  image: string;
}

export type Post = BasePost | ImagePost | VideoPost | GalleryPost | LinkPost | TextPost;

export interface CommentRaw {
  data: {
    author: string;
    body_html: string;
    created_utc: number;
    name: string;
    parent_id: string;
    replies: "" | {
      data: {
        children: (CommentRaw | MoreItemsRaw)[];
      };
    };
    score: number;
    author_fullname?: string;
  };
  kind: "t1";
}

export interface MoreItemsRaw {
  data: {
    children: string[];
    count: number;
    parent_id: string;
  };
  kind: "more";
}

export interface Comment {
  avatar: string;
  contentHtml: string;
  dateCreated: number;
  id: string;
  score: number;
  userId: string | null;
  userName: string;
}

export interface CommentThread {
  comment: Comment;
  replies: CommentThread[];
  moreReplies: string[];
  moreRepliesCount: number;
}

export interface MoreItems {
  count: number;
  ids: string[];
}

export type CommentsSortingMethod =
  | "confidence"
  | "top"
  | "new"
  | "controversial"
  | "old"
  | "random"
  | "qa"
  | "live";

export interface UserRaw {
  profile_img: string;
}

export interface User {
  avatar: string;
  id: string;
}
