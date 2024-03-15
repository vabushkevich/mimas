import React, { useRef } from "react";
import { useLocalStorage, useTextAreaAutoHeight } from "@hooks";
import { usePostComment } from "@services/api";

import { Button, Loader } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  parentId: string;
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

export function CommentForm({ parentId, onSubmit }: CommentFormProps) {
  const [text = "", setText] = useStoredReply(parentId);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeight = useTextAreaAutoHeight(textAreaRef);
  const { isLoading: isSubmitting, mutate: postComment } = usePostComment({
    onSuccess: () => setText(""),
  });

  return (
    <form
      className="comment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        postComment({ parentId, text }, { onSuccess: onSubmit });
      }}
    >
      <textarea
        ref={textAreaRef}
        style={{ height: textAreaHeight }}
        disabled={isSubmitting}
        maxLength={10000}
        placeholder="Leave a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="comment-form__button">
        <Button
          disabled={text.trim().length == 0 || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader colorMode="light" /> : "Post"}
        </Button>
      </div>
    </form>
  );
}
