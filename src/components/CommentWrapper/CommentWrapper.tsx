import React from "react";

import "./CommentWrapper.scss";

type CommentWrapperProps = {
  collapseButtonDisabled?: boolean;
  onCollapseButtonClick?: () => void;
  children: React.ReactNode;
};

export function CommentWrapper({
  collapseButtonDisabled,
  onCollapseButtonClick,
  children,
}: CommentWrapperProps) {
  return (
    <div className="comment-wrapper">
      <button
        disabled={collapseButtonDisabled}
        className="comment-wrapper__collapse-btn"
        onClick={onCollapseButtonClick}
      ></button>
      <div className="comment-wrapper__body">{children}</div>
    </div>
  );
}
