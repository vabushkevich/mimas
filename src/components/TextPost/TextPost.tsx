import React, { useState, useRef, useLayoutEffect } from "react";
import type { TextPost, PostProps } from "@types";
import classNames from "classnames";

import { BasePost } from "../BasePost/BasePost";
import { UserContent } from "../UserContent/UserContent";
import "./TextPost.scss";

const MAX_BODY_HEIGHT = 300;

export function TextPost(props: PostProps<TextPost>) {
  const { post, collapsed } = props;
  const { bodyHtml } = post;

  const [isTall, setIsTall] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (collapsed == null && bodyRef.current) {
      setIsTall(bodyRef.current.clientHeight > MAX_BODY_HEIGHT);
    }
  }, [collapsed, bodyHtml]);

  return (
    <BasePost {...props}>
      {bodyHtml.length > 0 && (
        <div
          className={classNames(
            "text-post-body",
            (collapsed ?? isTall) && "text-post-body--collapsed",
          )}
          ref={bodyRef}
        >
          <UserContent html={bodyHtml} />
        </div>
      )}
    </BasePost>
  );
}
