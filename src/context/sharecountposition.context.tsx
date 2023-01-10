import { createContext, useState } from "react";

interface ISharecountPositionContext {
  sharecountPositionContext: number;
  setSharecountPositionContext: (position: number) => void;
}

const SharecountPositionContext = createContext(
  {} as ISharecountPositionContext
);

export function SharecountPositionContextProvider({ children }: any) {
  const [sharecountPositionContext, setSharecountPositionContext] =
    useState<number>(0);

  return (
    <SharecountPositionContext.Provider
      value={{
        sharecountPositionContext,
        setSharecountPositionContext,
      }}
    >
      {children}
    </SharecountPositionContext.Provider>
  );
}

export default SharecountPositionContext;
