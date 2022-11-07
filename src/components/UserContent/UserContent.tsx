import React from "react";

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
