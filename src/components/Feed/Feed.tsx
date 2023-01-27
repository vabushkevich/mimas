import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";
import {
  Post,
  PostSortingMethod,
  isPostSortingMethod,
  SortTimeInterval,
  isSortTimeInterval,
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
  subreddit?: string;
};

export function Feed({ subreddit }: FeedProps) {
  const sortRouteParam = location.pathname.split("/").filter(Boolean).at(-1);
  const timeQueryParam = new URLSearchParams(location.search).get("t");

  const [postSorting, setPostSorting] = useState<PostSortingMethod>(
    isPostSortingMethod(sortRouteParam) ? sortRouteParam : "hot"
  );
  const [sortTimeInterval, setSortTimeInterval] = useState<SortTimeInterval>(
    isSortTimeInterval(timeQueryParam) ? timeQueryParam : "day"
  );
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
      sort: postSorting,
      sortTimeInterval,
      subreddit,
    });
    setPosts(more ? (posts) => [...posts, ...newPosts] : newPosts);
  };

  useEffect(() => {
    loadPosts({ limit: 5 });
  }, [postSorting, sortTimeInterval]);

  return (
    <div className="feed">
      <div className="feed__sort">
        <Card>
          <div className="feed__sort-items">
            <DropdownMenu
              items={postSortingMenu}
              label={({ content }) => content}
              selectedValue={postSorting}
              onSelect={({ value }) => {
                const url = new URL(location.href);
                const path = url.pathname.split("/").filter(Boolean);
                if (isPostSortingMethod(path.at(-1))) path.pop();
                path.push(value);
                url.pathname = path.join("/");
                history.replaceState(null, "", url);
                setPostSorting(value);
              }}
            />
            {isSortRequiresTimeInterval(postSorting) && (
              <DropdownMenu
                items={sortTimeIntervalMenu}
                label={({ content }) => content}
                selectedValue={sortTimeInterval}
                onSelect={({ value }) => {
                  const url = new URL(location.href);
                  url.searchParams.set("t", value);
                  history.replaceState(null, "", url);
                  setSortTimeInterval(value);
                }}
              />
            )}
          </div>
        </Card>
      </div>
      <PostList posts={posts} removeSubreddit />
      {posts.length > 0 && (
        <IntersectionDetector
          marginTop={100}
          onIntersect={() => loadPosts({ limit: 5, more: true })}
        />
      )}
    </div>
  );
}
