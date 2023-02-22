import React from "react";
import { NavLink } from "react-router-dom";
import { useSubreddits } from "@services/api";

import "./Sidebar.scss";

const navItems: {
  text: string;
  href: string;
}[] = [
  { text: "Test", href: "/" },
  { text: "Popular", href: "/r/popular/" },
  { text: "All Posts", href: "/r/all/" },
];

const subredditIds = ["t5_2qh33", "t5_2qh1i", "t5_2qh1o", "t5_2qh1u", "t5_2qqjc", "t5_2qh3s", "t5_mouw", "t5_2szyo", "t5_2qh1e", "t5_2qjpg", "t5_2sbq3", "t5_2qh87", "t5_2qh7a", "t5_2ti4h", "t5_2qt55", "t5_2qgzt", "t5_2tk95", "t5_3gdh7", "t5_2x93b", "t5_m0bnr"];

export function Sidebar() {
  const { data: subreddits } = useSubreddits(subredditIds);

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
    </nav>
  );
};
