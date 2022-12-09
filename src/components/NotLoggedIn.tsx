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
      <div className="p-3 flex flex-col items-center text-text">
        You are not logged in.
        <Button
          variant="contained"
          sx={{ width: 200, margin: 2, borderRadius: 30 }}
          onClick={() => navigate("/login")}
        >
          Profile
        </Button>
      </div>
    </div>
  );
};

export default NotLoggedIn;
