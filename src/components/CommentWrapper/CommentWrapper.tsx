import React from "react";

import "./CommentWrapper.scss";

type CommentWrapperProps = {
  onCollapseButtonClick?: () => void;
  children: React.ReactNode;
};

export function CommentWrapper({
  onCollapseButtonClick,
  children,
}: CommentWrapperProps) {
  return (
    <div className="comment-wrapper">
      <button
        className="comment-wrapper__collapse-btn"
        onClick={onCollapseButtonClick}
      ></button>
      <div className="comment-wrapper__body">
        {children}
      </div>
    </div>
  );
}
