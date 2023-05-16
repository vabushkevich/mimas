import React, { useState } from "react";
import classNames from "classnames";
import { useTypedSelector } from "@hooks";
import { useDispatch } from "react-redux";
import { toggleThread } from "@store/collapsed-threads/actions";
import type { Comment as CommentType } from "@types";

import { Comment, CommentThreadList, CommentWrapper } from "@components";
import "./CommentThread.scss";

type CommentThreadProps = {
  comment: CommentType;
  commentAuthorAvatar?: string;
};

export function CommentThread({
  comment,
  commentAuthorAvatar,
}: CommentThreadProps) {
  const { childIds, id, moreChildren } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const collapsed = useTypedSelector((state) => state.ids.includes(id));
  const dispatch = useDispatch();
  const renderReplies = childIds.length > 0 || moreChildren || showReplyForm;

  return (
    <div className="comment-thread">
      <CommentWrapper onCollapseButtonClick={() => dispatch(toggleThread(id))}>
        <Comment
          avatar={commentAuthorAvatar}
          collapsed={collapsed}
          comment={comment}
          onReplyButtonClick={() => setShowReplyForm((v) => !v)}
        />
      </CommentWrapper>
      {renderReplies && (
        <div
          className={classNames(
            "comment-thread__replies",
            collapsed && "comment-thread__replies--collapsed",
          )}
        >
          <CommentThreadList
            commentIds={childIds}
            moreComments={moreChildren}
            parentId={id}
            showReplyForm={showReplyForm}
            onReply={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
