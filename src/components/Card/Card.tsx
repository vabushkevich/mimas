import React from "react";
import classNames from "classnames";

import "./Card.scss";

type CardProps = {
  hideOverflow?: boolean;
  children: React.ReactNode;
};

export function Card({ hideOverflow = false, children }: CardProps) {
  return (
    <div
      className={classNames(
        "card",
        hideOverflow && "card--overflow-hidden",
      )}
    >
      {children}
    </div>
  );
}
