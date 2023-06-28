import React, { createContext, useContext, useState } from "react";

import "./TransitionsContext.scss";

type TransitionsContextType = {
  transitionsEnabled: boolean;
  disableTransitions: () => void;
  enableTransitions: () => void;
};

const TransitionsContext = createContext<TransitionsContextType | null>(null);

export function useTransitions() {
  const context = useContext(TransitionsContext);

  if (context == null) {
    throw new Error("useTransitions was used outside of its Provider");
  }

  return context;
}

export function TransitionsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);

  const contextValue = {
    transitionsEnabled,
    disableTransitions: () => {
      document.documentElement.setAttribute("data-transitions-disabled", "");
      setTransitionsEnabled(false);
    },
    enableTransitions: () => {
      document.documentElement.removeAttribute("data-transitions-disabled");
      setTransitionsEnabled(true);
    },
  };

  return (
    <TransitionsContext.Provider value={contextValue}>
      {children}
    </TransitionsContext.Provider>
  );
}
