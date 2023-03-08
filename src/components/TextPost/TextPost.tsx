import React from "react";
import type { TextPost, PostProps } from "@types";
import classNames from "classnames";

import { BasePost, UserContent } from "@components";
import "./TextPost.scss";

export function TextPost(props: PostProps<TextPost>) {
  const {
    post,
    collapsed = post.bodyHtml.length > 500,
  } = props;
  const { bodyHtml } = post;

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
