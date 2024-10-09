import React, { useRef } from "react";
import { useAuthGuard, useLocalStorage, useTextAreaAutoHeight } from "@hooks";
import { useEditComment, usePostComment } from "@services/api";

import { Button, Loader } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  autoFocus?: boolean;
  cancelable?: boolean;
  initialText?: string;
  isEdit?: boolean;
  targetId: string;
  onCancel?: () => void;
  onSubmit?: () => void;
};

function useStoredComment(
  targetId: string,
  { isEdit = false } = {},
): [string | undefined, (value: string) => void] {
  const type = isEdit ? "edit" : "reply";
  const [text, _setText, remove] = useLocalStorage<string>(
    `${type}:${targetId}`,
  );
  const setText = (newText: string) => {
    if (newText.trim()) {
      _setText(newText);
    } else {
      remove();
    }
  };

  return [text, setText];
}

export function CommentForm({
  autoFocus,
  cancelable,
  initialText = "",
  isEdit,
  targetId,
  onCancel,
  onSubmit,
}: CommentFormProps) {
  const [text = initialText, setText] = useStoredComment(targetId, { isEdit });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeight = useTextAreaAutoHeight(textAreaRef, text);
  const submitButtonText = isEdit ? "Save" : "Post";
  const clearText = () => setText("");

  const postCommentMutation = usePostComment({ onSuccess: clearText });
  const editCommentMutation = useEditComment({ onSuccess: clearText });
  const postComment = useAuthGuard(postCommentMutation.mutate);
  const editComment = useAuthGuard(editCommentMutation.mutate);
  const isSubmitting =
    postCommentMutation.isLoading || editCommentMutation.isLoading;

  return (
    <form
      className="comment-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (isEdit) {
          editComment({ id: targetId, text }, { onSuccess: onSubmit });
        } else {
          postComment({ parentId: targetId, text }, { onSuccess: onSubmit });
        }
      }}
    >
      <textarea
        autoFocus={autoFocus}
        ref={textAreaRef}
        style={{ height: textAreaHeight }}
        disabled={isSubmitting}
        maxLength={10000}
        placeholder="Leave a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="comment-form__controls">
        {cancelable && (
          <Button
            color="transparent"
            disabled={isSubmitting}
            type="reset"
            onClick={() => {
              setText("");
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          disabled={text.trim().length == 0 || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader color="white" /> : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
