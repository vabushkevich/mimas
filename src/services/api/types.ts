export type BasePost = {
  data: {
    archived: boolean;
    author_fullname?: string;
    author: string;
    created_utc: number;
    edited: number | boolean;
    is_video: boolean;
    likes: boolean | null;
    locked: boolean;
    media: {} | null;
    name: string;
    num_comments: number;
    permalink: string;
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
    media: {
      reddit_video: {
        hls_url: string;
      };
    };
    preview: {
      images: ResponsiveMedia[];
    };
  }
};

export type GIFPost = BasePost & {
  data: {
    post_hint: "image";
    preview: {
      images: (ResponsiveMedia & Variants<"mp4">)[];
    };
  }
};

export type GalleryPost = BasePost & {
  data: {
    gallery_data: {
      items: {
        caption?: string;
        media_id: string;
      }[];
    };
    media_metadata: Record<string, ResponsiveMediaShort>;
  }
}

export type TextPost = BasePost & {
  data: {
    selftext_html: string;
  }
};

export type LinkPost = BasePost & {
  data: {
    url_overridden_by_dest: string;
  }
};

export type YouTubePost = BasePost & {
  data: {
    media: {
      oembed: {
        html: string;
      };
      type: "youtube.com";
    };
  }
};

export type Post =
  | ImagePost
  | VideoPost
  | GIFPost
  | GalleryPost
  | TextPost
  | LinkPost
  | YouTubePost;

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
    link_id: string;
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

export type ResponsiveMediaShort = {
  p: {
    u: string;
    x: number;
    y: number;
  }[];
  s: {
    u: string;
    x: number;
    y: number;
  };
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
