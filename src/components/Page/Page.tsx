import React from "react";

import { Navbar, Sidebar } from "@components";
import "./Page.scss";

type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  return (
    <div className="page">
      <Navbar />
      <div className="page__layout">
        <Sidebar />
        <div className="page__content">
          {children}
        </div>
      </div>
    </div>
  );
}
