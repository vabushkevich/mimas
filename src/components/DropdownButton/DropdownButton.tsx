import React from "react";

import { Button, ButtonProps } from "@components";
import DownIcon from "@assets/svg/arrow-down.svg";

export type DropdownButtonProps = ButtonProps;

export const DropdownButton = function DropdownButton(
  props: DropdownButtonProps,
) {
  return (
    <Button
      color="gray"
      rightIcon={<DownIcon height="10" />}
      {...props}
    ></Button>
  );
};
