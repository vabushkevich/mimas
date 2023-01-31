import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@components";
import "./Navbar.scss";

export function Navbar() {
  return (
    <nav className="site-nav">
      <Link className="site-nav__logo" to="/">
        reddit-client
      </Link>
      <div className="site-nav__login-btn">
        <Button>Sign in with Reddit</Button>
      </div>
    </nav>
  );
}
