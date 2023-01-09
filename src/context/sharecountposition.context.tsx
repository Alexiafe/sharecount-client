import { createContext, useState } from "react";

interface ISharecountPositionContext {
  sharecountIdContext: string;
  sharecountPositionContext: number;
  setSharecountIdContext: (id: string) => void;
  setPositionContext: (position: number) => void;
}

const SharecountPositionContext = createContext(
  {} as ISharecountPositionContext
);

export function SharecountPositionContextProvider({ children }: any) {
  const [sharecountIdContext, setSharecountIdContext] = useState<string>("");
  const [sharecountPositionContext, setPositionContext] = useState<number>(0);

  return (
    <SharecountPositionContext.Provider
      value={{
        sharecountIdContext,
        sharecountPositionContext,
        setSharecountIdContext,
        setPositionContext,
      }}
    >
      {children}
    </SharecountPositionContext.Provider>
  );
}

export default SharecountPositionContext;
