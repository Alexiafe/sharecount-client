// Interfaces
import { ISharecountContext } from "../interfaces/interfaces";

import { createContext, useEffect, useState } from "react";

interface ISharecountsContext {
  sharecountsContext: ISharecountContext[];
  setSharecountsContext: (sharecounts: ISharecountContext[]) => void;
}

const SharecountsContext = createContext({} as ISharecountsContext);

export function SharecountsContextProvider({ children }: any) {
  const [sharecountsContext, setSharecountsContext] = useState<ISharecountContext[]>([]);

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
