import React from "react";

import "./Flair.scss";

type FlairProps = {
  className?: string;
  text: string;
};

export function Flair({ className, text }: FlairProps) {
  return (
    <span className={`flair ${className}`} title={text}>
      {text}
    </span>
  );
}
