import React from "react";
import { TextPost as TextPostProps } from "@types";

import { BasePost } from "@components";

export function TextPost(props: TextPostProps) {
  return (
    <BasePost {...props}>
      <div
        className="text-post-body"
        dangerouslySetInnerHTML={{ __html: props.contentHtml }}>
      </div>
    </BasePost>
  );
}
