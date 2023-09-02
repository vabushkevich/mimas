import React from "react";
import { NavLink } from "react-router-dom";
import { isPostFeedSortingOption } from "@types";

import "./SidebarItem.scss";

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export function SidebarItem({ href, icon, children }: SidebarItemProps) {
  return (
    <NavLink
      className="sidebar-item"
      activeClassName="sidebar-item--active"
      exact={href == "/"}
      to={href}
      isActive={(match, { pathname }) => {
        if (match) return true;
        return href == "/" && isPostFeedSortingOption(pathname.split("/")[1]);
      }}
    >
      <div className="sidebar-item__icon">{icon}</div>
      <div className="sidebar-item__text">{children}</div>
    </NavLink>
  );
}
