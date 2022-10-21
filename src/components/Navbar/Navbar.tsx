import React from "react";
import classNames from "classnames";

import "./Navbar.scss";

type NavbarProps = {
  items: {
    text: string;
    href: string;
  }[];
};

export function Navbar({ items }: NavbarProps) {
  return (
    <nav className="site-nav">
      <ul>
        {items.map(({ text, href }) => {
          const active = window.location.pathname == href;
          return (
            <li key={href}>
              <a
                className={classNames(
                  "site-nav__item",
                  active && "site-nav__item--active",
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
}
