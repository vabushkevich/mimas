import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useParams, useSearchParams } from "@hooks";
import { useUserByName } from "@services/api";
import {
  isPostFeedSortingOption,
  isSortTimeInterval,
  isCommentFeedSortingOption,
} from "@types";

import { AuthorHeader } from "../AuthorHeader/AuthorHeader";
import { AuthorHeaderSkeleton } from "../AuthorHeader/AuthorHeaderSkeleton";
import { CommentFeed } from "../CommentFeed/CommentFeed";
import { Container } from "../Container/Container";
import { Page } from "../Page/Page";
import { PostFeed } from "../PostFeed/PostFeed";
import "./UserPage.scss";

export function UserPage() {
  const [{ name: userName }] = useParams<{ name: string }>();
  const [searchParams, setSearchParams] = useSearchParams<{
    sort?: string;
    t?: string;
  }>();

  const postSorting = isPostFeedSortingOption(searchParams.sort)
    ? searchParams.sort
    : undefined;
  const commentSorting = isCommentFeedSortingOption(searchParams.sort)
    ? searchParams.sort
    : undefined;
  const sortTimeInterval = isSortTimeInterval(searchParams.t)
    ? searchParams.t
    : undefined;

  const { path, url } = useRouteMatch();
  const { data: user, isLoading } = useUserByName(userName);

  const feedProps = {
    sortTimeInterval,
    userName,
    onSortChange: (sort: string) => {
      setSearchParams({ sort });
    },
    onSortTimeIntervalChange: (sortTimeInterval: string) => {
      setSearchParams({ ...searchParams, t: sortTimeInterval });
    },
  };

  return (
    <Page title={userName}>
      <Container>
        <div className="user-page__header">
          {isLoading && <AuthorHeaderSkeleton showTabs />}
          {user && (
            <AuthorHeader
              avatar={user.avatar}
              description={user.description}
              name={user.name}
              stats={[
                {
                  label: "Comment Carma",
                  value: compactNumber(user.commentKarma),
                },
                {
                  label: "Post Carma",
                  value: compactNumber(user.postKarma),
                },
                {
                  label: "Account Age",
                  title: formatDate(user.dateCreated),
                  value: formatDistanceToNow(user.dateCreated),
                },
              ]}
              tabs={[
                { label: "Posts", href: url, exact: true },
                { label: "Comments", href: `${url}/comments` },
              ]}
            />
          )}
        </div>
        <Switch>
          <Route exact path={path}>
            <PostFeed sort={postSorting} type="user" {...feedProps} />
          </Route>
          <Route path={`${path}/comments`}>
            <CommentFeed sort={commentSorting} {...feedProps} />
          </Route>
          <Route path="*">
            <Redirect to={url} />
          </Route>
        </Switch>
      </Container>
    </Page>
  );
}
