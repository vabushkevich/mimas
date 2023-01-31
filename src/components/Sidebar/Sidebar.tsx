import React from "react";
import { NavLink } from "react-router-dom";

import "./Sidebar.scss";

const navItems: {
  text: string;
  href: string;
}[] = [
  { text: "Test", href: "/" },
  { text: "Popular", href: "/r/popular/" },
  { text: "All Posts", href: "/r/all/" },
];

export function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        {navItems.map(({ text, href }) => (
          <li key={href}>
            <NavLink
              activeClassName="sidebar__item--active"
              className="sidebar__item"
              exact={href == "/"}
              to={href}
            >
              {text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
