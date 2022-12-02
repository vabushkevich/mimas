import React from "react";
import { TextPost } from "@types";
import classNames from "classnames";

import { BasePost, UserContent } from "@components";
import "./TextPost.scss";

interface TextPostProps extends TextPost {
  collapsed?: boolean;
}

export function TextPost(props: TextPostProps) {
  const {
    bodyHtml,
    collapsed = false,
  } = props;

  return (
    <BasePost {...props}>
      {bodyHtml.length > 0 && (
        <div
          className={classNames(
            "text-post-body",
            collapsed && "text-post-body--collapsed",
          )}
        >
          <UserContent html={bodyHtml} />
        </div>
      )}
    </BasePost>
  );
}
