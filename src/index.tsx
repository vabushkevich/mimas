import React from "react";
import ReactDOM from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthContextProvider } from "@services/auth";

import { App } from "./App";

import "normalize.css";
import "@sass/_global.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          < App />
        </AuthContextProvider>
      </QueryClientProvider>
    </Provider>
  ),
  document.querySelector("#root")
);
