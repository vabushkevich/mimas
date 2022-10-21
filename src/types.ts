export interface PostData {
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

export interface TextPost extends BasePost {
  contentHtml: string;
}

export interface GalleryPost extends BasePost {
  images: string[];
}

export interface VideoPost extends BasePost {
  video: string;
}

export interface ImagePost extends BasePost {
  image: string;
}
