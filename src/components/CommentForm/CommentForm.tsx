import React, { useState } from "react";

import { Button } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  onSubmit?: (text: string) => void;
  onSuccess?: () => void;
};

export function CommentForm({ onSubmit, onSuccess }: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="comment-form"
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        (async () => onSubmit?.(text))()
          .then(() => setText(""))
          .finally(() => setIsSubmitting(false))
          .then(onSuccess)
          .catch(() => {});
      }}
    >
      <textarea
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
          Post
        </Button>
      </div>
    </form>
  );
}
