import React, { useLayoutEffect, useState } from "react";
import { shortenText } from "@utils";

import "./ReadMore.scss";

type ReadMoreProps = {
  maxLength?: number;
  text: string;
};

export function ReadMore({ maxLength = 200, text }: ReadMoreProps) {
  const [collapsed, setCollapsed] = useState(true);

  useLayoutEffect(() => {
    setCollapsed(true);
  }, [text]);

  if (text.length > maxLength && collapsed) {
    return (
      <div className="read-more" onClick={() => setCollapsed(false)}>
        {shortenText(text, maxLength)}
        <button className="read-more__button">more</button>
      </div>
    );
  }

  return <>{text}</>;
}
