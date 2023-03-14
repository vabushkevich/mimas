import React, { useState } from "react";

import { Button } from "@components";
import "./CommentForm.scss";

type CommentFormProps = {
  onSubmit?: (text: string) => Promise<unknown>;
};

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="comment-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (onSubmit) onSubmit(text)
          .then(() => setText(""))
          .catch(() => { })
          .finally(() => setIsSubmitting(false));
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
