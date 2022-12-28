// Components
import { Button } from "@mui/material";

// MUI
import Header from "./Header";

// Firebase
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const NotLoggedIn = () => {
  return (
    <div>
      <Header title="Sharecount"></Header>
      <div className="p-4 flex flex-col items-center text-text">
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
};

export default NotLoggedIn;
