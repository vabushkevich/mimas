import React, { memo } from "react";
import { useComment } from "@services/api";

import { CommentThread } from "@components";

type CommentThreadContainerProps = {
  commentId: string;
  depth: number;
};

export const CommentThreadContainer = memo(function CommentThreadContainer({
  commentId,
  depth,
}: CommentThreadContainerProps) {
  const { data: comment } = useComment(commentId);

  return comment ? <CommentThread comment={comment} depth={depth} /> : null;
});
