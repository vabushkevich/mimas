import React from "react";
import { useHistory } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { useFeedParams } from "@hooks";
import { useUserByName } from "@services/api";

import {
  Container,
  Page,
  AuthorHeader,
  Feed,
  AuthorHeaderSkeleton,
} from "@components";
import "./UserPage.scss";

export function UserPage() {
  const { author: userName, sort, sortTimeInterval } = useFeedParams();
  const { data: user, isLoading } = useUserByName(userName);
  const history = useHistory();

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
            history.replace({ search: `?sort=${sort}` });
          }}
          onSortTimeIntervalChange={(sortTimeInterval) => {
            const params = new URLSearchParams(history.location.search);
            params.set("t", sortTimeInterval);
            history.replace({ search: String(params) });
          }}
        />
      </Container>
    </Page>
  );
}
