import { createContext, useEffect, useState } from "react";

interface ISharecountList {
  id: number;
  name: string;
  currency: string;
  balance: number;
}

interface ISharecountsContext {
  sharecountsContext: ISharecountList[];
  setSharecountsContext: (sharecounts: ISharecountList[]) => void;
}

const SharecountsContext = createContext({} as ISharecountsContext);

export function SharecountsContextProvider({ children }: any) {
  const [sharecountsContext, setSharecountsContext] = useState<
    ISharecountList[]
  >([]);

  useEffect(() => {}, []);

  return (
    <SharecountsContext.Provider
      value={{ sharecountsContext, setSharecountsContext }}
    >
      {children}
    </SharecountsContext.Provider>
  );
}

export default SharecountsContext;
