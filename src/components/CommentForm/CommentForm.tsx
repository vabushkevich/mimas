import React, { useRef } from "react";
import { useAuthGuard, useLocalStorage, useTextAreaAutoHeight } from "@hooks";
import { usePostComment } from "@services/api";

import { Button, Loader } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  autoFocus?: boolean;
  cancelable?: boolean;
  parentId: string;
  onCancel?: () => void;
  onSubmit?: () => void;
};

function useStoredReply(
  parentId: string,
): [string | undefined, (value: string) => void] {
  const [text, _setText, remove] = useLocalStorage<string>(`reply:${parentId}`);
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
  parentId,
  onCancel,
  onSubmit,
}: CommentFormProps) {
  const [text = "", setText] = useStoredReply(parentId);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeight = useTextAreaAutoHeight(textAreaRef, text);
  const postCommentMutation = usePostComment({ onSuccess: () => setText("") });
  const { isLoading: isSubmitting } = postCommentMutation;
  const postComment = useAuthGuard(postCommentMutation.mutate);

  return (
    <form
      className="comment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        postComment({ parentId, text }, { onSuccess: onSubmit });
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
          {isSubmitting ? <Loader color="white" /> : "Post"}
        </Button>
      </div>
    </form>
  );
}
