import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { isPostSortingMethod, isSortTimeInterval, User } from "@types";
import { ClientContext } from "@context";
import { useQuery } from "@hooks";

import { Container, Page, AuthorHeader, Feed } from "@components";
import "./UserPage.scss";

export function UserPage() {
  const query = useQuery<{ sort: string, t: string }>();
  const sort = isPostSortingMethod(query.sort) ? query.sort : "hot";
  const sortTimeInterval = isSortTimeInterval(query.t) ? query.t : "day";

  const [user, setUser] = useState<User>();
  const client = useContext(ClientContext);
  const { name: userName } = useParams<{ name: string }>();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const user = await client.getUser(userName);
      setUser(user);
    })();
  }, [userName]);

  return (
    <Page>
      <Container>
        {user ? (
          <div className="user-page__header">
            <AuthorHeader
              name={user.name}
              picture={user.avatar}
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
          </div>
        ) : <div>Loading...</div>}
        <Feed
          sort={sort}
          sortTimeInterval={sortTimeInterval}
          userName={userName}
          onSortChange={(sort) => {
            history.replace({ search: `?sort=${sort}` });
          }}
          onSortTimeIntervalChange={(sortTimeInterval) => {
            const params = new URLSearchParams(query);
            params.set("t", sortTimeInterval);
            history.replace({ search: String(params) });
          }}
        />
      </Container>
    </Page>
  );
}
