export type Post = {
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

export type Subreddit = {
  community_icon: string;
  icon_img: string;
};

export type Comment = {
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
        children: (Comment | MoreItems)[];
      };
    };
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

export type User = {
  profile_img: string;
};
