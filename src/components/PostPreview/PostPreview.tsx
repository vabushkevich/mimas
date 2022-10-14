import React from "react";
import { Post } from "@types";

import { BasePost } from "@components";

export function PostPreview(props: Post) {
  return <BasePost {...props} />;
}
