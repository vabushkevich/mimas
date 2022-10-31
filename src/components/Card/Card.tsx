import React from "react";

import "./Card.scss";

type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}
