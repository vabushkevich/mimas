declare module "*.png";
declare module "*.svg?external";
declare module "*.svg?inline" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
