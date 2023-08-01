import React, { memo } from "react";
import { useComment, useAvatar } from "@services/api";

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
  const commentAuthorAvatar = useAvatar(comment?.userId);

  return comment ? (
    <CommentThread
      comment={comment}
      commentAuthorAvatar={commentAuthorAvatar}
      depth={depth}
    />
  ) : null;
});
