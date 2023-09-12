import React, { useState } from "react";

import { Button } from "@components";

type SubscribeButtonProps = Omit<Parameters<typeof Button>[0], "children"> & {
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
