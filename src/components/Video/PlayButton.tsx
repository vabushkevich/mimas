import React from "react";

import { Loader } from "@components";
import "./PlayButton.scss";

type PlayButtonProps = {
  loading?: boolean;
};

export function PlayButton({ loading = false }: PlayButtonProps) {
  return (
    <div className="play-button">
      {loading ? (
        <Loader colorMode="light" />
      ) : (
        <div className="play-button__icon"></div>
      )}
    </div>
  );
}
