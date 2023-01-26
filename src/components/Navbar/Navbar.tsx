import React from "react";

import { Button } from "@components";
import "./Navbar.scss";

export function Navbar() {
  return (
    <nav className="site-nav">
      <a className="site-nav__logo" href="/">
        reddit-client
      </a>
      <div className="site-nav__login-btn">
        <Button>Sign in with Reddit</Button>
      </div>
    </nav>
  );
}
