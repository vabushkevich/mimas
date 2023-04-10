import React from "react";

import "./UserContent.scss";

type UserContentProps = {
  html?: string;
  children?: React.ReactNode;
};

export function UserContent({ html, children }: UserContentProps) {
  return (
    <div
      className="user-content"
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {children}
    </div>
  );
}
