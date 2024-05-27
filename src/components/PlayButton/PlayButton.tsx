import React from "react";

import { Loader } from "@components";
import PlayIcon from "./assets/play.svg";
import "./PlayButton.scss";

type PlayButtonProps = {
  loading?: boolean;
};

export function PlayButton({ loading = false }: PlayButtonProps) {
  return (
    <div className="play-button">
      {loading ? (
        <Loader color="white" />
      ) : (
        <PlayIcon className="play-button__icon" />
      )}
    </div>
  );
}
