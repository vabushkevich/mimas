import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useParams, useSearchParams } from "@hooks";
import { useUserByName } from "@services/api";
import { isPostSortingOption, isSortTimeInterval } from "@types";

import {
  Container,
  Page,
  AuthorHeader,
  Feed,
  AuthorHeaderSkeleton,
} from "@components";
import "./UserPage.scss";

export function UserPage() {
  const [{ name: userName }] = useParams<{ name: string }>();
  const [searchParams, setSearchParams] = useSearchParams<{
    sort?: string;
    t?: string;
  }>();

  const sort = isPostSortingOption(searchParams.sort)
    ? searchParams.sort
    : undefined;
  const sortTimeInterval = isSortTimeInterval(searchParams.t)
    ? searchParams.t
    : undefined;

  const { data: user, isLoading } = useUserByName(userName);

  return (
    <Page title={userName}>
      <Container>
        <div className="user-page__header">
          {isLoading && <AuthorHeaderSkeleton />}
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
            />
          )}
        </div>
        <Feed
          sort={sort}
          sortTimeInterval={sortTimeInterval}
          type="user"
          userName={userName}
          onSortChange={(sort) => {
            setSearchParams({ sort });
          }}
          onSortTimeIntervalChange={(sortTimeInterval) => {
            setSearchParams({ ...searchParams, t: sortTimeInterval });
          }}
        />
      </Container>
    </Page>
  );
}
