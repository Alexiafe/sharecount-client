import { createContext, useEffect, useState } from "react";

interface IUserContext {
  userContext: string;
  setUserContext: (user: string) => void;
}

const UserContext = createContext({} as IUserContext);

export function UserContextProvider({ children }: any) {
  const [userContext, setUserContext] = useState<string>("");

  useEffect(() => {}, []);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
