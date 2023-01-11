import React, { forwardRef, ForwardedRef } from "react";

import { Button } from "@components";
import "./DropdownButton.scss";

export const DropdownButton = forwardRef(function DropdownButton(
  props: Parameters<typeof Button>[0],
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      ref={ref}
      rightIcon={<span className="arrow-down-icon"></span>}
      {...props}
    ></Button>
  );
});
