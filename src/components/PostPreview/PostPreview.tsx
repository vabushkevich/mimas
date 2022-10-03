import React from "react";

type PostPreviewProps = {
  commentCount: number;
  dateCreated: number;
  score: number;
  title: string;
  userName: string;
};

export function PostPreview({
  commentCount,
  dateCreated,
  score,
  title,
  userName,
}: PostPreviewProps) {
  return (
    <div className="post-preview">
      <div className="post-preview__score">Score: {score}</div>
      <div className="post-preview__heading">Posted by {userName}. Date: {new Date(dateCreated).toLocaleString()}</div>
      <div className="post-preview__title">{title}</div>
      <div className="post-preview__comment-count">{commentCount} comments</div>
    </div>
  );
}
