import React from "react";

import "./CommentWrapper.scss";

type CommentWrapperProps = {
  collapseButtonDisabled?: boolean;
  indent?: number;
  onCollapseButtonClick?: () => void;
  children: React.ReactNode;
};

export function CommentWrapper({
  collapseButtonDisabled,
  indent,
  onCollapseButtonClick,
  children,
}: CommentWrapperProps) {
  return (
    <div className="comment-wrapper">
      <button
        disabled={collapseButtonDisabled}
        className="comment-wrapper__collapse-btn"
        style={indent ? { paddingLeft: `${indent}px` } : {}}
        onClick={onCollapseButtonClick}
      ></button>
      <div className="comment-wrapper__body">{children}</div>
    </div>
  );
}
