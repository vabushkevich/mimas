import React from "react";

import "./UserContent.scss";

type UserContentProps = {
  contentHtml: string;
};

export function UserContent({ contentHtml }: UserContentProps) {
  return (
    <div
      className="user-content"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    ></div>
  );
}
