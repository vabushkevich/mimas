import React from "react";
import { Link } from "react-router-dom";
import { useAuth, getAuthURL } from "@services/auth";

import { Button } from "@components";
import "./Navbar.scss";

export function Navbar() {
  const { authorized, unauthorize } = useAuth();

  return (
    <nav className="site-nav">
      <Link className="site-nav__logo" to="/">
        reddit-client
      </Link>
      <div className="site-nav__login-btn">
        {authorized ? (
          <Button onClick={unauthorize}>Sign Out</Button>
        ) : (
          <Button onClick={() => location.assign(getAuthURL())}>
            Sign in with Reddit
          </Button>
        )}
      </div>
    </nav>
  );
}
