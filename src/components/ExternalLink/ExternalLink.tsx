import React from "react";

export function ExternalLink(props: React.ComponentPropsWithoutRef<"a">) {
  return <a rel="noopener noreferrer" target="_blank" {...props} />;
}
