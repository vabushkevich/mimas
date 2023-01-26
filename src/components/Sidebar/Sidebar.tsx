import React from "react";
import classNames from "classnames";

import "./Sidebar.scss";

const navItems: {
  text: string;
  href: string;
}[] = [
  { text: "Test", href: "/" },
  { text: "Hot", href: "/hot" },
];

export function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        {navItems.map(({ text, href }) => {
          const active = location.pathname == href;
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
