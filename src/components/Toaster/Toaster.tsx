import React from "react";
import { Toaster as ReactToaster } from "react-hot-toast";

import "./Toaster.scss";

export function Toaster() {
  return <ReactToaster toastOptions={{ className: "toast" }} />;
}
