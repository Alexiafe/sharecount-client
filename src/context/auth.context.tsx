import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

import { auth } from "../firebase-config";
import { addUserService, getUserService } from "../services/user.service";

interface IAuthContext {
  userSession: User;
  userLoading: boolean;
}

const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: any) {
  const [userSession, setUserSession] = useState<User>({} as User);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (userSession) => {
      if (userSession) {
        // Login
        const userData = await getUserService(userSession.email!);
        if (!userData) {
          addUserService(userSession.email!);
        }
        setUserSession(userSession);
      } else {
        // Logout
        setUserSession({} as User);
      }
      setUserLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
