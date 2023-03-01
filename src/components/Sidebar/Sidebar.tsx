import React from "react";
import { NavLink } from "react-router-dom";
import { useSidebarSubreddits } from "./hooks";

import { SidebarItemsSkeleton } from "./SidebarItemsSkeleton";
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
  const { data: subreddits, isLoading } = useSidebarSubreddits();

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
      {subreddits && (
        <ul>
          {subreddits.map(({ avatar, name }) => (
            <li key={name}>
              <NavLink
                activeClassName="sidebar__item--active"
                className="sidebar__item"
                to={`/r/${name}`}
              >
                <div
                  className="sidebar__item-icon"
                  style={{ backgroundImage: `url("${avatar}")` }}
                ></div>
                <div className="sidebar__item-text">{name}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
      {isLoading && <SidebarItemsSkeleton count={5} />}
    </nav>
  );
};
