import React, { forwardRef, ForwardedRef } from "react";

import { Button } from "@components";
import DownIcon from "@assets/svg/arrow-down.svg";

export const DropdownButton = forwardRef(function DropdownButton(
  props: Parameters<typeof Button>[0],
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      ref={ref}
      color="gray"
      rightIcon={<DownIcon width="10" />}
      {...props}
    ></Button>
  );
});
