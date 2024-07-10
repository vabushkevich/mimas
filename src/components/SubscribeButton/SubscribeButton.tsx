import React, { useState } from "react";

import { Button, ButtonProps } from "@components";

type SubscribeButtonProps = Omit<ButtonProps, "children"> & {
  subscribed?: boolean;
};

export const SubscribeButton = function SubscribeButton({
  subscribed,
  ...buttonProps
}: SubscribeButtonProps) {
  const [hover, setHover] = useState(false);
  const text = (() => {
    if (subscribed && hover) return "Unsubscribe";
    return subscribed ? "Subscribed" : "Subscribe";
  })();

  return (
    <Button
      color={subscribed ? "gray" : "blue"}
      width="120px"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...buttonProps}
    >
      {text}
    </Button>
  );
};
