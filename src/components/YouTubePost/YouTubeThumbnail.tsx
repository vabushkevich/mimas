import React, { useEffect, useRef, useState } from "react";

export function YouTubeThumbnail({ videoId }: { videoId: string }) {
  const [show, setShow] = useState(false);
  const [fileName, setFileName] = useState("hq720");
  const ref = useRef<HTMLImageElement>();

  useEffect(() => {
    const image = ref.current;
    const handleLoad = () => {
      if (fileName == "hq720"
        && image.naturalWidth == 120
        && image.naturalHeight == 90
      ) {
        // Fallback to `hqdefault.jpg` if `hq720.jpg` doesn't exist
        setFileName("hqdefault");
      } else {
        setShow(true);
      }
    };

    image.addEventListener("load", handleLoad, { once: true });
    if (image.complete) handleLoad();
  }, [fileName]);

  return (
    <img
      ref={ref}
      src={`https://i.ytimg.com/vi/${videoId}/${fileName}.jpg`}
      style={!show ? { visibility: "hidden" } : {}}
    />
  );
}
