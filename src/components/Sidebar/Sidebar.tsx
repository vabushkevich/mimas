import React from "react";
import { NavLink } from "react-router-dom";
import { useSidebarSubreddits } from "./hooks";
import { useAuth } from "@services/auth";
import { isPostSortingMethod } from "@types";

import { Avatar } from "@components";
import { SidebarMenuSkeleton } from "./SidebarMenuSkeleton";
import "./Sidebar.scss";

export function Sidebar() {
  const { authorized } = useAuth();
  const { data: subreddits, isLoading } = useSidebarSubreddits();

  const navItems: { name: string; text: string; href: string }[] = [];
  if (authorized) navItems.push({ name: "feed", text: "My Feed", href: "/" });
  navItems.push({
    name: "popular",
    text: "Popular",
    href: authorized ? "/r/all/" : "/",
  });

  return (
    <nav className="sidebar">
      <div className="sidebar__body">
        <ul className="sidebar__menu sidebar__menu--user">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                activeClassName="sidebar__item--active"
                className="sidebar__item"
                exact={item.href == "/"}
                isActive={(match, location) => {
                  if (match) return true;
                  return (
                    item.href == "/" &&
                    isPostSortingMethod(location.pathname.split("/")[1])
                  );
                }}
                to={item.href}
              >
                <div
                  className={[
                    "sidebar__item-icon",
                    `sidebar__item-icon--${item.name}`,
                  ].join(" ")}
                ></div>
                <div className="sidebar__item-text">{item.text}</div>
              </NavLink>
            </li>
          ))}
        </ul>
        {subreddits && (
          <ul className="sidebar__menu">
            {subreddits
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ avatar, name }) => (
                <li key={name}>
                  <NavLink
                    activeClassName="sidebar__item--active"
                    className="sidebar__item"
                    to={`/r/${name}`}
                  >
                    <div className="sidebar__item-icon">
                      <Avatar name={name} size="sm" src={avatar} />
                    </div>
                    <div className="sidebar__item-text">{name}</div>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}
        {isLoading && <SidebarMenuSkeleton count={5} />}
      </div>
      <div className="sidebar__footer">
        <a // eslint-disable-line react/jsx-no-target-blank
          className="sidebar__github-icon"
          href="https://github.com/vabushkevich/mimas"
          target="_blank"
        ></a>
      </div>
    </nav>
  );
}
