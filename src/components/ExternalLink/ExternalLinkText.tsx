import React from "react";

import ExternalIcon from "./assets/external.svg";
import "./ExternalLinkText.scss";

type ExternalLinkTextProps = {
  children?: React.ReactNode;
};

export function ExternalLinkText({ children }: ExternalLinkTextProps) {
  return (
    <span className="external-link-text">
      {children}
      <ExternalIcon className="external-link-text__icon" />
    </span>
  );
}
