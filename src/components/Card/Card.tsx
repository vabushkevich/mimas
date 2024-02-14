import React from "react";
import classNames from "classnames";

import "./Card.scss";

type CardProps = {
  border?: boolean;
  hideOverflow?: boolean;
  children: React.ReactNode;
};

export function Card({ border, hideOverflow = false, children }: CardProps) {
  return (
    <div
      className={classNames(
        "card",
        border && "card--border",
        hideOverflow && "card--overflow-hidden",
      )}
    >
      {children}
    </div>
  );
}
