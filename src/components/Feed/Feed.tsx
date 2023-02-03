import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";
import {
  Post,
  PostSortingMethod,
  SortTimeInterval,
  isSortRequiresTimeInterval,
} from "@types";

import {
  PostList,
  IntersectionDetector,
  Card,
  DropdownMenu,
} from "@components";
import "./Feed.scss";

const postSortingMenu: {
  content: string;
  value: PostSortingMethod;
}[] = [
  { value: "best", content: "Best" },
  { value: "hot", content: "Hot" },
  { value: "top", content: "Top" },
  { value: "new", content: "New" },
  { value: "rising", content: "Rising" },
  { value: "controversial", content: "Controversial" },
];

const sortTimeIntervalMenu: {
  content: string;
  value: SortTimeInterval;
}[] = [
  { value: "hour", content: "Hour" },
  { value: "day", content: "Day" },
  { value: "week", content: "Week" },
  { value: "month", content: "Month" },
  { value: "year", content: "Year" },
  { value: "all", content: "All Time" },
];

type FeedProps = {
  removeSubreddit?: boolean;
  sort?: PostSortingMethod;
  sortTimeInterval?: SortTimeInterval;
  subreddit?: string;
  userName?: string;
  onSortChange?: (v: PostSortingMethod) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
};

export function Feed({
  removeSubreddit,
  sort,
  sortTimeInterval,
  subreddit,
  userName,
  onSortChange = () => { },
  onSortTimeIntervalChange = () => { },
}: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const client = useContext(ClientContext);

  const loadPosts = async ({
    limit,
    more = false,
  }: {
    limit?: number;
    more?: boolean;
  }) => {
    const newPosts = await client.getFeedPosts({
      after: more ? posts.at(-1)?.id : null,
      limit,
      sort,
      sortTimeInterval,
      subreddit,
      userName,
    });
    setPosts(more ? (posts) => [...posts, ...newPosts] : newPosts);
  };

  useEffect(() => {
    loadPosts({ limit: 5 });
  }, [sort, sortTimeInterval]);

  return (
    <div className="feed">
      <div className="feed__sort">
        <Card>
          <div className="feed__sort-items">
            <DropdownMenu
              items={postSortingMenu}
              label={({ content }) => content}
              selectedValue={sort}
              onSelect={({ value }) => onSortChange(value)}
            />
            {isSortRequiresTimeInterval(sort) && (
              <DropdownMenu
                items={sortTimeIntervalMenu}
                label={({ content }) => content}
                selectedValue={sortTimeInterval}
                onSelect={({ value }) => onSortTimeIntervalChange(value)}
              />
            )}
          </div>
        </Card>
      </div>
      <PostList posts={posts} removeSubreddit={removeSubreddit} />
      {posts.length > 0 && (
        <IntersectionDetector
          marginTop={100}
          onIntersect={() => loadPosts({ limit: 5, more: true })}
        />
      )}
    </div>
  );
}
