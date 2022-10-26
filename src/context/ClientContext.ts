import { createContext } from "react";
import { RedditWebAPI } from "@services/reddit-web-api";

export const ClientContext = createContext<RedditWebAPI>(null);
