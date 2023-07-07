import React from "react";
import { NavLink } from "react-router-dom";
import { useSidebarSubreddits } from "./hooks";
import { useAuth } from "@services/auth";
import { isPostSortingMethod } from "@types";

import { Avatar, NavbarLogo } from "@components";
import { SidebarMenuSkeleton } from "./SidebarMenuSkeleton";
import FeedIcon from "./assets/feed.svg";
import TopIcon from "./assets/top.svg";
import GithubIcon from "./assets/github.svg";
import "./Sidebar.scss";

type SidebarProps = {
  showHeader?: boolean;
};

export function Sidebar({ showHeader = false }: SidebarProps) {
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
      {showHeader && (
        <div className="sidebar__header">
          <NavbarLogo />
        </div>
      )}
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
                {item.name == "feed" ? (
                  <FeedIcon className="sidebar__item-icon" />
                ) : (
                  <TopIcon className="sidebar__item-icon" />
                )}
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
          href="https://github.com/vabushkevich/mimas"
          target="_blank"
        >
          <GithubIcon className="sidebar__github-icon" />
        </a>
      </div>
    </nav>
  );
}
