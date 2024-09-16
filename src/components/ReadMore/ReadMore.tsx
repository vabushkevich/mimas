import React, { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { getLineCount, getLineHeight } from "@utils";

import "./ReadMore.scss";

type ReadMoreProps = {
  previewLines: number;
  text: string;
};

export function ReadMore({ previewLines, text }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const isPreview = !isExpanded && previewHeight != null;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    function updatePreviewHeight() {
      const elem = ref.current;
      if (!elem) return;

      const lineCount = getLineCount(elem);
      const lineHeight = getLineHeight(elem);
      const exceedsPreview = lineCount > previewLines;

      setPreviewHeight(exceedsPreview ? previewLines * lineHeight : null);
    }

    updatePreviewHeight();

    window.addEventListener("resize", updatePreviewHeight);
    return () => window.removeEventListener("resize", updatePreviewHeight);
  }, [previewLines, text]);

  return (
    <div
      className={classNames("read-more", isPreview && "read-more--preview")}
      onClick={() => isPreview && setIsExpanded(true)}
    >
      <div
        className="read-more__text"
        ref={ref}
        style={isPreview ? { height: `${previewHeight}px` } : {}}
      >
        {text}
      </div>
      {isPreview && <button className="read-more__button">more</button>}
    </div>
  );
}
