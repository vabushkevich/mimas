import React from "react";

import { Button } from "@components";
import "./DropdownButton.scss";

export function DropdownButton(props: Parameters<typeof Button>[0]) {
  return (
    <Button
      rightIcon={<span className="arrow-down-icon"></span>}
      {...props}
    ></Button>
  );
}
