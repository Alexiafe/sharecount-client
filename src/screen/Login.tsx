// Context
import AuthContext from "../context/auth.context";

// Components
import HeaderThin from "../components/Common/HeaderThin";
import MenuHome from "../components/Common/MenuHome";
import Loader from "../components/Common/Loader";

// React
import { useContext } from "react";

// MUI
import { Button } from "@mui/material/";

// Firebase
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const Login = () => {
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  if (userLoading) {
    return (
      <div>
        <HeaderThin title="Profile"></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else
    return (
      <div>
        <HeaderThin title="Profile"></HeaderThin>
        {userEmail ? (
          <div className="flex flex-col p-4 items-center text-text">
            You're logged in as {userEmail}
            <Button
              variant="contained"
              sx={{ width: 200, margin: 2 }}
              onClick={() => signOut(auth)}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col p-4 items-center">
            <Button
              variant="contained"
              sx={{ width: 200, margin: 2 }}
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            >
              Login
            </Button>
          </div>
        )}
        <footer className="flex bottom-0 absolute w-full">
          <MenuHome screen="profile"></MenuHome>
        </footer>
      </div>
    );
};

export default Login;
