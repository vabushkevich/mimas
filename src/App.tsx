import React from "react";

import { TestPage, Navbar } from "@components";

export function App() {
  const navItems = [
    { text: "Test", href: "/" },
  ];

  return (
    <>
      <Navbar items={navItems} />
      <TestPage />
    </>
  );
}
