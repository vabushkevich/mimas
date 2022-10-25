import React from "react";

import { TestPage, Navbar, HotPage, PostPage } from "@components";

function isPostPage() {
  return /\/comments\/\w+\//.test(location.pathname);
}

export function App() {
  const navItems = [
    { text: "Test", href: "/" },
    { text: "Hot", href: "/hot" },
  ];
  const Page = isPostPage() ? PostPage : {
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
