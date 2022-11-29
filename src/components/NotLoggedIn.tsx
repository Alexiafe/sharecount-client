// Components
import { Button } from "@mui/material";

// React
import { useNavigate } from "react-router-dom";

// MUI
import Header from "./Header";

const NotLoggedIn = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Sharecount"></Header>
      <div className="p-3">You are not logged in.</div>
      <div className="text-center">
        <Button
          variant="contained"
          sx={{ width: 200, margin: 2 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default NotLoggedIn;
