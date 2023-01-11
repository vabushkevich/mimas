import React, { useState, useEffect, useContext } from "react";
import { User as UserType } from "@types";
import { ClientContext } from "@context";

import { Container, Page } from "@components";
import { User } from "./User";

export function UserPage() {
  const [user, setUser] = useState<UserType>();
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
        {user ? <User {...user} /> : <div>Loading...</div>}
      </Container>
    </Page>
  );
}
