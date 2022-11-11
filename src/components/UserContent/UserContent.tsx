import React from "react";

import "./UserContent.scss";

type UserContentProps = {
  html: string;
};

export function UserContent({ html }: UserContentProps) {
  return (
    <div
      className="user-content"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
