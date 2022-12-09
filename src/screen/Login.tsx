// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "../components/Header";
import MenuHome from "../components/MenuHome";
import Loader from "../components/Loader";

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
        <Header title="Profile"></Header>
        <Loader></Loader>
      </div>
    );
  } else
    return (
      <div className="h-screen flex flex-col">
        <Header title="Profile"></Header>
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
        <footer
          className="flex bg-gray-200 bottom-0 absolute w-full"
          style={{ height: "100px" }}
        >
          <MenuHome screen="profile"></MenuHome>
        </footer>
      </div>
    );
};

export default Login;
