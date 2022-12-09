// MUI
import GridViewIcon from "@mui/icons-material/GridView";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";

interface IPropsMenuHome {
  screen?: string;
}

const MenuHome = (props: IPropsMenuHome) => {
  const screen = props.screen;
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full bg-white text-center"
      style={{ height: "100px" }}
    >
      <div className="flex-1 self-center">
        <IconButton size="large" onClick={() => navigate("/")}>
          <GridViewIcon
            className={`${screen === "home" ? "text-secondary" : "text-text"}`}
          />
        </IconButton>
      </div>
      <div className="flex-1 self-center">
        <IconButton onClick={() => navigate("/sharecount-add")}>
          <AddCircleIcon className="text-text" sx={{ fontSize: 45 }} />
        </IconButton>
      </div>
      <div className="flex-1 self-center">
        <IconButton size="large" onClick={() => navigate("/login")}>
          <PersonIcon
            className={`${
              screen === "profile" ? "text-secondary" : "text-text"
            }`}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default MenuHome;
