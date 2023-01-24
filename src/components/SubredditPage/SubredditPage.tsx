import React, { useState, useEffect, useContext } from "react";
import { ClientContext } from "@context";
import { Post, PostSortingMethod, isPostSortingMethod } from "@types";

import {
  PostList,
  Container,
  Page,
  IntersectionDetector,
  Card,
  DropdownMenu,
} from "@components";
import "./SubredditPage.scss";

const postSortingMenu: {
  content: string;
  value: PostSortingMethod;
}[] = [
  { value: "hot", content: "Hot" },
  { value: "top", content: "Top" },
  { value: "new", content: "New" },
  { value: "rising", content: "Rising" },
];

export function SubredditPage() {
  const subreddit = location.pathname.match(/\/r\/(\w+)/)[1];
  const sortRouteParam = location.pathname.split("/").filter(Boolean).at(-1);

  const [postSorting, setPostSorting] = useState<PostSortingMethod>(
    isPostSortingMethod(sortRouteParam) ? sortRouteParam : "hot"
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const client = useContext(ClientContext);

  const loadPosts = async (limit?: number) => {
    const newPosts = await client.getFeedPosts({
      limit,
      sort: postSorting,
      subreddit,
    });
    setPosts(newPosts);
  };

  const loadMorePosts = async (limit?: number) => {
    const newPosts = await client.getFeedPosts({
      after: posts.at(-1)?.id,
      limit,
      sort: postSorting,
      subreddit,
    });
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    loadPosts(5);
  }, [postSorting]);

  return (
    <Page>
      <Container>
        <div className="post-sorting">
          <Card>
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
          </Card>
        </div>
        <PostList posts={posts} removeSubreddit />
        {posts.length > 0 && (
          <IntersectionDetector
            marginTop={100}
            onIntersect={() => loadMorePosts(5)}
          />
        )}
      </Container>
    </Page>
  );
}
