import React from "react";
import { NavLink } from "react-router-dom";
import { useSidebarSubreddits } from "./hooks";
import { useAuth } from "@services/auth";

import { Avatar } from "@components";
import { SidebarItemsSkeleton } from "./SidebarItemsSkeleton";
import "./Sidebar.scss";

export function Sidebar() {
  const { authorized } = useAuth();
  const { data: subreddits, isLoading } = useSidebarSubreddits();

  const navItems: {
    text: string;
    href: string;
  }[] = [
    authorized ? { text: "My Feed", href: "/" } : null,
    { text: "Popular", href: authorized ? "/r/all/" : "/" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar__body">
        <ul>
          {navItems.map((item) => item && (
            <li key={item.href}>
              <NavLink
                activeClassName="sidebar__item--active"
                className="sidebar__item"
                exact={item.href == "/"}
                to={item.href}
              >
                {item.text}
              </NavLink>
            </li>
          ))}
        </ul>
        {subreddits && (
          <ul>
            {subreddits
              .sort((a, b) => a.name > b.name ? 1 : -1)
              .map(({ avatar, name }) => (
                <li key={name}>
                  <NavLink
                    activeClassName="sidebar__item--active"
                    className="sidebar__item"
                    to={`/r/${name}`}
                  >
                    <div className="sidebar__item-icon">
                      <Avatar picture={avatar} size="sm" />
                    </div>
                    <div className="sidebar__item-text">{name}</div>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}
        {isLoading && <SidebarItemsSkeleton count={5} />}
      </div>
      <div className="sidebar__footer">
        <a
          className="sidebar__github-icon"
          href="https://github.com/vabushkevich/mimas"
        ></a>
      </div>
    </nav>
  );
};
