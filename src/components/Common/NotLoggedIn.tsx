// Components
import { Button } from "@mui/material";

// MUI
import HeaderThin from "./HeaderThin";

// Firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase-config";

const NotLoggedIn = () => {
  return (
    <div>
      <HeaderThin title="Sharecount"></HeaderThin>
      <div className="p-4 flex flex-col items-center">
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
