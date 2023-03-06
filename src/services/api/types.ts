export type Post = {
  data: {
    archived: boolean;
    author_fullname?: string;
    author: string;
    created_utc: number;
    edited: number | boolean;
    gallery_data?: {
      items: {
        media_id: string;
      }[];
    };
    is_video: boolean;
    likes: boolean | null;
    locked: boolean;
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
    removed_by_category:
      | "content_takedown"
      | "reddit"
      | "deleted"
      | "moderator"
      | null;
    score: number;
    selftext_html: string | null;
    stickied: boolean;
    subreddit_id: string;
    subreddit: string;
    title: string;
    url_overridden_by_dest?: string;
  };
};

export type Subreddit = {
  data: {
    active_user_count: number;
    community_icon: string;
    created_utc: number;
    display_name: string;
    icon_img: string;
    name: string;
    public_description: string;
    subscribers: number;
  };
  kind: "t5";
};

export type Comment = {
  data: {
    author_fullname?: string;
    author: string;
    body_html: string;
    body: string;
    created_utc: number;
    depth: number;
    distinguished: "moderator" | "admin" | null;
    edited: number | boolean;
    is_submitter: boolean;
    likes: boolean | null;
    locked: boolean;
    name: string;
    parent_id: string;
    score_hidden: boolean;
    score: number;
    stickied: boolean;
  };
  kind: "t1";
};

export type MoreItems = {
  data: {
    children: string[];
    count: number;
    parent_id: string;
  };
  kind: "more";
};

export type CommentListItem = Comment | MoreItems;

export type ShortUser = {
  comment_karma: number;
  created_utc: number;
  link_karma: number;
  name: string;
  profile_img: string;
};

export type FullUser = {
  data: {
    comment_karma: number;
    created_utc: number;
    icon_img: string;
    id: string;
    link_karma: number;
    name: string;
  };
  kind: "t2";
};

export type Listing<T> = {
  data: {
    children: T[];
  };
};

export type Things<T> = {
  json: {
    data: {
      things: T[];
    };
  };
};

export type Identity = FullUser["data"] & {
  // Some other fields...
};
