import { createContext } from "react";
import { User } from "@types";

export const UsersContext = createContext<Record<string, User>>({});
