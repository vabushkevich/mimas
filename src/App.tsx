import React from "react";

import { TestPage, Navbar, HotPage } from "@components";

export function App() {
  const navItems = [
    { text: "Test", href: "/" },
    { text: "Hot", href: "/hot" },
  ];
  const Page = {
    "/": TestPage,
    "/hot": HotPage,
  }[window.location.pathname];

  return (
    <>
      <Navbar items={navItems} />
      <Page />
    </>
  );
}
