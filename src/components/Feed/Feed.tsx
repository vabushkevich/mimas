import React, { useState, useEffect, useContext } from "react";
import {
  useHistory,
  useParams,
  useRouteMatch,
  generatePath,
} from "react-router-dom";
import { ClientContext } from "@context";
import {
  Post,
  PostSortingMethod,
  isPostSortingMethod,
  SortTimeInterval,
  isSortTimeInterval,
  isSortRequiresTimeInterval,
} from "@types";
import { useQuery } from "@hooks";

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
  subreddit?: string;
};

export function Feed({ removeSubreddit, subreddit }: FeedProps) {
  const { sort: sortRouteParam } = useParams<{ sort: string }>();
  const postSorting = isPostSortingMethod(sortRouteParam)
    ? sortRouteParam
    : "hot";

  const query = useQuery<{ t: string }>();
  const sortTimeInterval = isSortTimeInterval(query.t)
    ? query.t
    : "day";

  const [posts, setPosts] = useState<Post[]>([]);
  const client = useContext(ClientContext);
  const history = useHistory();
  const match = useRouteMatch();

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
                const pathname = generatePath(match.path, {
                  sort: value,
                  subreddit,
                });
                history.replace({ pathname });
              }}
            />
            {isSortRequiresTimeInterval(postSorting) && (
              <DropdownMenu
                items={sortTimeIntervalMenu}
                label={({ content }) => content}
                selectedValue={sortTimeInterval}
                onSelect={({ value }) => {
                  history.replace({ search: `?t=${value}` });
                }}
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
