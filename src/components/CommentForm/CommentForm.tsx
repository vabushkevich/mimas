import React, { useRef, useState } from "react";
import { useTextAreaAutoHeight } from "@hooks";
import { usePostComment } from "@services/api";

import { Button, Loader } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  parentId: string;
  onSubmit?: () => void;
};

export function CommentForm({ parentId, onSubmit }: CommentFormProps) {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeight = useTextAreaAutoHeight(textAreaRef);
  const { isLoading: isSubmitting, mutate: postComment } = usePostComment();

  return (
    <form
      className="comment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        postComment(
          { parentId, text },
          {
            onSuccess: () => {
              setText("");
              onSubmit?.();
            },
          },
        );
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
