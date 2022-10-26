import React from "react";

import { Navbar } from "@components";

type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  const navItems = [
    { text: "Test", href: "/" },
    { text: "Hot", href: "/hot" },
  ];

  return (
    <>
      <Navbar items={navItems} />
      {children}
    </>
  );
}
