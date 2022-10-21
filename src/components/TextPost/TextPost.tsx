import React from "react";
import { TextPost } from "@types";
import classNames from "classnames";

import { BasePost } from "@components";
import "./TextPost.scss";

interface TextPostProps extends TextPost {
  collapsed?: boolean;
}

export function TextPost(props: TextPostProps) {
  const {
    collapsed = false,
    contentHtml,
  } = props;

  return (
    <BasePost {...props}>
      <div
        className={classNames(
          "text-post-body",
          collapsed && "text-post-body--collapsed",
        )}
        dangerouslySetInnerHTML={{ __html: contentHtml }}>
      </div>
    </BasePost>
  );
}