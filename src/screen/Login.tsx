// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "../components/Header";

// React
import { useContext } from "react";

// MUI
import { Button } from "@mui/material/";

// Firebase
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const Login = () => {
  const { userSession } = useContext(AuthContext);
  const userEmail = userSession?.email;

  if (userEmail) {
    return (
      <div>
        <Header
          title="Profile"
          backButton={true}
          screen="Profile"
          emptyButtonR={true}
        ></Header>
        <div className="p-3 flex flex-col items-center">
          You're logged in as {userEmail}
          <Button
            variant="contained"
            sx={{ width: 200, margin: 2 }}
            onClick={() => signOut(auth)}
          >
            Log out
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title="Profile"
          backButton={true}
          screen="Profile"
          emptyButtonR={true}
        ></Header>
        <div className="p-3 flex flex-col items-center">
          <Button
            variant="contained"
            sx={{ width: 200, margin: 2 }}
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }
};

export default Login;
