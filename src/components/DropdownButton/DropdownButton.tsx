import React from "react";

import { Button } from "@components";
import DownIcon from "@assets/svg/arrow-down.svg";

export const DropdownButton = function DropdownButton(
  props: Parameters<typeof Button>[0],
) {
  return (
    <Button
      color="gray"
      rightIcon={<DownIcon width="10" />}
      {...props}
    ></Button>
  );
};
