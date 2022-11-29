import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

import { auth } from "../firebase-config";
import { addUserService, getUserService } from "../services/user.service";

interface IAuthContext {
  userSession: User;
  loading: boolean;
}

const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: any) {
  const [userSession, setUserSession] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

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
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
