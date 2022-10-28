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

export interface CommentThreadData {
  author: string;
  body_html: string;
  created_utc: number;
  name: string;
  replies: "" | {
    data: {
      children: {
        data: CommentThreadListItemData;
      }[];
    };
  };
  score: number;
}

export interface MoreCommentsData {
  children: string[];
}

export type CommentThreadListItemData = CommentThreadData | MoreCommentsData;

export interface Comment {
  avatar: string;
  contentHtml: string;
  dateCreated: number;
  id: string;
  score: number;
  userName: string;
}

export interface CommentThread {
  comment: Comment;
  replies: CommentThread[];
  moreReplies: string[];
}
