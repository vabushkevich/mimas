import React, { forwardRef } from "react";

import { ButtonProps, Button } from "../Button/Button";
import DownIcon from "@assets/svg/arrow-down.svg";

export type DropdownButtonProps = ButtonProps;

export const DropdownButton = forwardRef<
  React.ComponentRef<typeof Button>,
  DropdownButtonProps
>(function DropdownButton(props, ref) {
  return (
    <Button
      color="gray"
      ref={ref}
      rightIcon={<DownIcon height="10" />}
      {...props}
    ></Button>
  );
});
