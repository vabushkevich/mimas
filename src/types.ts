export interface PostData {
  author: string;
  created_utc: number;
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
    s: {
      u: string;
    };
  }>;
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
