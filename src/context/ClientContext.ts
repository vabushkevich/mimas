import { createContext } from "react";
import { RedditWebAPI } from "@services/api";

export const ClientContext = createContext<RedditWebAPI>(null);
