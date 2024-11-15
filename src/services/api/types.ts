export type BasePost = {
  data: {
    archived: boolean;
    author_flair_richtext?: FlairElement[];
    author_flair_text: string | null;
    author_flair_type?: "text" | "richtext";
    author_fullname?: string;
    author: string;
    created_utc: number;
    edited: number | boolean;
    is_video: boolean;
    likes: boolean | null;
    link_flair_richtext: FlairElement[];
    link_flair_text: string | null;
    link_flair_type: "text" | "richtext";
    locked: boolean;
    media: object | null;
    name: string;
    num_comments: number;
    permalink: string;
    pinned: boolean;
    removed_by_category: string | null;
    saved: boolean;
    score: number;
    selftext_html: string | null;
    stickied: boolean;
    subreddit_id: string;
    subreddit: string;
    title: string;
  };
};

export type ImagePost = BasePost & {
  data: {
    post_hint: "image";
    preview: {
      images: ResponsiveMedia[];
    };
  };
};

export type VideoPost = BasePost & {
  data: {
    is_video: true;
    media: {
      reddit_video: {
        height: number;
        hls_url: string;
        width: number;
      };
    };
    // Some video posts don't have a preview
    preview?: {
      images: ResponsiveMedia[];
    };
  };
};

export type ExternalVideoPost = BasePost & {
  data: {
    preview: {
      images: ResponsiveMedia[];
      reddit_video_preview: {
        height: number;
        hls_url: string;
        width: number;
      };
    };
  };
};

export type GIFPost = BasePost & {
  data: {
    post_hint: "image";
    preview: {
      images: (ResponsiveMedia & Variants<"mp4">)[];
    };
  };
};

export type GalleryPost = BasePost & {
  data: {
    gallery_data: {
      items: {
        caption?: string;
        media_id: string;
        outbound_url?: string;
      }[];
    };
    media_metadata: Record<string, ResponsiveMediaShort>;
  };
};

export type TextPost = BasePost & {
  data: {
    selftext_html: string;
  };
};

export type LinkPost = BasePost & {
  data: {
    url_overridden_by_dest: string;
  };
};

export type YouTubePost = BasePost & {
  data: {
    media: {
      oembed: {
        html: string;
      };
      type: "youtube.com";
    };
  };
};

export type CrossPost = BasePost & {
  data: {
    crosspost_parent_list: [Post["data"]];
    crosspost_parent: string;
  };
};

export type RemovedPost = BasePost & {
  data: {
    removed_by_category:
      | "content_takedown"
      | "reddit"
      | "deleted"
      | "moderator"
      | "copyright_takedown"
      | "automod_filtered"
      | "author"
      | "community_ops";
  };
};

export type Post =
  | ImagePost
  | VideoPost
  | ExternalVideoPost
  | GIFPost
  | GalleryPost
  | TextPost
  | LinkPost
  | YouTubePost
  | CrossPost
  | RemovedPost;

export type BaseSubreddit = {
  data: {
    community_icon: string;
    created_utc: number;
    display_name: string;
    icon_img: string | null;
    name: string;
    public_description: string;
    subreddit_type: string;
  };
  kind: "t5";
};

export type PublicSubreddit = BaseSubreddit & {
  data: {
    active_user_count: number | null;
    subreddit_type: "public" | "restricted" | "gold_restricted" | "archived";
    subscribers: number;
    user_is_subscriber: boolean | null;
  };
};

export type PrivateSubreddit = BaseSubreddit & {
  data: {
    active_user_count: null;
    subreddit_type: "private";
    subscribers: null;
    user_is_subscriber: null;
  };
};

export type Subreddit = PublicSubreddit | PrivateSubreddit;

export type Comment = {
  data: {
    author_flair_richtext?: FlairElement[];
    author_flair_text: string | null;
    author_flair_type?: "text" | "richtext";
    author_fullname?: string;
    author: string;
    body_html: string;
    body: string;
    created_utc: number;
    depth?: number;
    distinguished: "moderator" | "admin" | null;
    edited: number | boolean;
    is_submitter: boolean;
    likes: boolean | null;
    link_id: string;
    link_title?: string;
    locked: boolean;
    name: string;
    parent_id: string;
    permalink: string;
    score_hidden: boolean;
    score: number;
    stickied: boolean;
    subreddit: string;
    subreddit_id: string;
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
    subreddit: {
      public_description: string;
    };
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

export type ResponsiveMediaShort = {
  p: {
    u: string;
    x: number;
    y: number;
  }[];
  s:
    | {
        gif: string;
        x: number;
        y: number;
      }
    | {
        u: string;
        x: number;
        y: number;
      };
  status: "valid" | "failed";
};

export type ResponsiveMedia = {
  resolutions: {
    height: number;
    url: string;
    width: number;
  }[];
  source: {
    height: number;
    url: string;
    width: number;
  };
};

type Variants<T extends string> = {
  variants: {
    [P in T]: ResponsiveMedia;
  };
};

export type RedditError = {
  error: number;
  message: string;
  reason: string;
};

export type FlairTextElement = {
  e: "text";
  t: string;
};

export type FlairEmojiElement = {
  a: string;
  e: "emoji";
  u: string;
};

export type FlairElement = FlairTextElement | FlairEmojiElement;
