import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthContextProvider } from "@services/auth";
import { queryClient } from "@services/query-client";
import { DarkModeContextProvider } from "@context";

import { App } from "./App";

import "normalize.css";
import "@sass/_global.scss";

ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </Provider>,
  document.querySelector("#root"),
);
