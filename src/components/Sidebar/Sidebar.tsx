import React from "react";
import classNames from "classnames";

import "./Sidebar.scss";

const navItems: {
  text: string;
  href: string;
}[] = [
  { text: "Test", href: "/" },
  { text: "Popular", href: "/r/popular/" },
  { text: "All Posts", href: "/r/all/" },
];

function isCurrentPage(href: string) {
  const { pathname } = location;
  if (href == "/") return pathname == href;
  return pathname.startsWith(href);
}

export function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        {navItems.map(({ text, href }) => {
          const active = isCurrentPage(href);
          return (
            <li key={href}>
              <a
                className={classNames(
                  "sidebar__item",
                  active && "sidebar__item--active",
                )}
                href={href}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
