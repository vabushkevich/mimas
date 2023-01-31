import React, { useState, useEffect, useContext } from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { User } from "@types";
import { ClientContext } from "@context";

import { Container, Page, AuthorHeader } from "@components";

export function UserPage() {
  const [user, setUser] = useState<User>();
  const client = useContext(ClientContext);
  const userName = location.pathname.match(/\/user\/([\w-]+)/)[1];

  useEffect(() => {
    (async () => {
      const user = await client.getUser(userName);
      setUser(user);
    })();
  }, []);

  return (
    <Page>
      <Container>
        {user ? (
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
        ) : <div>Loading...</div>}
      </Container>
    </Page>
  );
}
