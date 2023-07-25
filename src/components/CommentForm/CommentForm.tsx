import React, { useRef, useState } from "react";
import { useTextAreaAutoHeight } from "@hooks";

import { Button, Loader } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  onError?: (error: unknown) => void;
  onSubmit?: (text: string) => void | Promise<unknown>;
  onSuccess?: () => void;
};

export function CommentForm({
  onError,
  onSubmit,
  onSuccess,
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeight = useTextAreaAutoHeight(textAreaRef);

  return (
    <form
      className="comment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          await onSubmit?.(text);
          onSuccess?.();
          setText("");
        } catch (error) {
          onError?.(error);
        } finally {
          setIsSubmitting(false);
        }
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
